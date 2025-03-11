// filepath: /e:/projects/feedback/backend/Controllers/LoginController.cs
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.UserDataAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/login")]
    public class LoginController : Controller
    {
        DBManager dbManager = new DBManager();

        private readonly ILogger<LoginController> _logger;
        private readonly RecaptchaService _recaptchaService;

        public LoginController(ILogger<LoginController> logger, RecaptchaService recaptchaService)
        {
            _logger = logger;
            _recaptchaService = recaptchaService;
        }

        [HttpPost]
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

                var db = dbManager.connect();
                var query = @$"SELECT * FROM check_login_credentials('{loginCredentials.Email}', '{loginCredentials.Password}')";

                var user = dbManager.select(db, query);

                if (user == null || user.Count == 0)
                    return Unauthorized(new { message = "Invalid email or password" });

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
