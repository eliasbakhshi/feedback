// filepath: /e:/projects/feedback/backend/Controllers/RegistrationController.cs
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using backend.Models;
using backend.UserDataAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/main")]
    public class MainController : Controller
    {
        private readonly DBManager dbManager = new DBManager();
        private readonly ILogger<MainController> _logger;
        private readonly RecaptchaService _recaptchaService;

        public MainController(ILogger<MainController> logger, RecaptchaService recaptchaService)
        {
            _logger = logger;
            _recaptchaService = recaptchaService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel registration)
        {
            try
            {
                // Verify reCAPTCHA token
                var isHuman = await _recaptchaService.VerifyRecaptchaAsync(registration.RecaptchaToken);

                if (!isHuman)
                {
                    return BadRequest(new { message = "reCAPTCHA verification failed." });

                }

                using (var dbCheck = dbManager.connect())
                {
                    string checkEmail = $"SELECT COUNT(*) FROM accounts WHERE email = '{registration.Email}';";
                    var check = dbManager.select(dbCheck, checkEmail);
                    var result = check.FirstOrDefault()?["count"] as long?;
                    bool exists = result.HasValue && result.Value > 0;

                    if (exists)
                    {
                        return BadRequest(new { message = "Failed to register user; user already exists." });

                    }
                }

                using (var dbInsert = dbManager.connect())
                {
                    if (registration.Password?.Length < 6)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; password must be at least 6 characters.");
                    }

                    var query = @$"CALL create_account('{registration.FirstName}', '{registration.LastName}', '{registration.Email}', '{registration.Password}', '{registration.Role}')";

                    if (dbManager.insert(dbInsert, query))
                    {
                        _logger.LogInformation($"User {registration.Email} registered successfully.");
                        return Ok(new { message = "User registered successfully." });
                    }
                    else
                    {
                        return BadRequest(new { message = "Failed to register user; database error." });
                    }
                }
            }
            catch (NullReferenceException ex)
            {
                _logger.LogError(ex, "An error occurred while registering a new user.");
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; missing arguments.");
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginCredentials)
        {
            try
            {
                // Verify reCAPTCHA token
                var isHuman = await _recaptchaService.VerifyRecaptchaAsync(loginCredentials.RecaptchaToken);

                if (!isHuman)
                {
                    return BadRequest(new { message = "reCAPTCHA verification failed." });
                }

                int? userID = null;
                string? role = null;

                using (var db = dbManager.connect()) {
                    var query = @$"SELECT * FROM check_login_credentials('{loginCredentials.Email}', '{loginCredentials.Password}')";
                    var user = dbManager.select(db, query);

                    if (user == null || user.Count == 0)
                        return Unauthorized(new { Message = "Invalid email or password" });

                    var userData = user[0];
                    _logger.LogInformation($"User with email {loginCredentials.Email} logged in.");

                    userID = (int)userData["id"] as int?;
                    role = userData["role"]?.ToString();
                }

                using (var db = dbManager.connect()) {
                    string token = createToken();

                    string saveTokenQuery = @$"CALL add_token('{token}', {userID})";
                    var result = dbManager.select(db, saveTokenQuery);
                }

                string? hashedToken = null;
                using (var db = dbManager.connect()) {
                    var getTokenQuery = @$"SELECT * FROM get_hashed_token({userID})";
                    var result = dbManager.select(db, getTokenQuery);

                    if (result != null && result.Count > 0)
                        hashedToken = result[0]["get_hashed_token"]?.ToString();
                }

                if (hashedToken == null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new {Message = "Failed to get token"});

                return Ok(new {
                    Message = "Login successful",
                    Token = hashedToken,
                    UserId = userID,
                    Role = role
                });
            }
            catch (Exception ex) {
                _logger.LogError(ex, "An error occurred when logging in.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to login user." });
            }
        }

        public string createToken() {
            byte[] tokenBytes = RandomNumberGenerator.GetBytes(32);
            return Convert.ToBase64String(tokenBytes);
        }
    }
}
