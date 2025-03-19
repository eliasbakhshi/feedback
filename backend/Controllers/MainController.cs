using System;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.UserDataAccess;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/main")]
    public class MainController : Controller
    {
        private readonly DBManager _dbManager;
        private readonly ILogger<MainController> _logger;
        private readonly RecaptchaService _recaptchaService;
        private readonly EmailService _emailService; 

    public MainController(
        ILogger<MainController> logger,
        RecaptchaService recaptchaService,
        DBManager dbManager,
        EmailService emailService)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _recaptchaService = recaptchaService ?? throw new ArgumentNullException(nameof(recaptchaService));
        _dbManager = dbManager ?? throw new ArgumentNullException(nameof(dbManager));
        _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
    }


        [HttpPost("registration")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel registration)
        {
            try
            {
                if (string.IsNullOrEmpty(registration.Email) || string.IsNullOrEmpty(registration.Password))
                {
                    return BadRequest(new { message = "Email and password are required." });
                }

                using (var dbCheck = _dbManager.connect())
                {
                    string checkEmail = $"SELECT COUNT(*) FROM accounts WHERE email = '{registration.Email}';";
                    var check = _dbManager.select(dbCheck, checkEmail);
                    var result = check.FirstOrDefault()?["count"] as long?;
                    bool exists = result.HasValue && result.Value > 0;

                    if (exists)
                    {
                        return BadRequest(new { message = "Failed to register user; user already exists." });
                    }
                }

                string token = Guid.NewGuid().ToString();

                using (var dbInsert = _dbManager.connect())
                {
                    if (registration.Password.Length < 6)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; password must be at least 6 characters.");
                    }

                    var query = @$"
                        CALL create_account(
                            '{registration.FirstName}', 
                            '{registration.LastName}', 
                            '{registration.Email}', 
                            '{registration.Password}', 
                            '{registration.Role}', 
                            '{token}'
                        )";

                    if (_dbManager.insert(dbInsert, query))
                        {
                            _logger.LogInformation($"User {registration.Email} registered successfully.");
                            _logger.LogInformation($"First Name: {registration.FirstName}");
                            _logger.LogInformation($"Last Name: {registration.LastName}");
                            _logger.LogInformation($"Email: {registration.Email}");
                            _logger.LogInformation($"Role: {registration.Role}");
                            _logger.LogInformation($"Token: {token}");

                            string verificationUrl = $"http://localhost:5172/api/verify/confirm?token={token}";
                            string emailBody = $@"
                                <p>Click the link below to verify your account:</p>
                                <a href=""{verificationUrl}"">Verify My Account</a>
                            ";

                            var emailSent = await _emailService.SendEmail(registration.Email, "Verify Your Account", emailBody);
                            if (!emailSent)
                            {
                                _logger.LogError("Failed to send verification email.");
                                return StatusCode(500, new { message = "Failed to send verification email." });
                            }

                            return Ok(new { message = "User registered successfully. Verification email sent." });
                        }
                        else
                        {
                            _logger.LogError("Failed to register user; database error.");
                            return BadRequest(new { message = "Failed to register user; database error." });
                        }

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while registering a new user.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to register user." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginCredentials)
        {
            try
            {
                var isHuman = await _recaptchaService.VerifyRecaptchaAsync(loginCredentials.RecaptchaToken);
                if (!isHuman)
                {
                    return BadRequest(new { message = "reCAPTCHA verification failed." });
                }

                using var db = _dbManager.connect();
                var query = @$"
                    SELECT * 
                    FROM check_login_credentials('{loginCredentials.Email}', '{loginCredentials.Password}')
                ";

                var user = _dbManager.select(db, query);

                if (user == null || user.Count == 0)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                var userData = user[0];
                _logger.LogInformation($"User with email {loginCredentials.Email} logged in.");

                return Ok(new
                {
                    message = "Login successful",
                    UserId = (int)userData["id"],
                    Role = userData["role"].ToString()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when logging in.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to login user." });
            }
        }
    }
}
