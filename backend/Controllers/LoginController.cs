using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using backend.Models;
using backend.UserDataAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers {
    [Route("api/login")]
    public class LoginController : Controller {
        DBManager dbManager = new DBManager();

        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger) {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginModel loginCredentials) {
            try {
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
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Failed to login user." });
            }
        }

        public string createToken() {
            byte[] tokenBytes = RandomNumberGenerator.GetBytes(32);
            return Convert.ToBase64String(tokenBytes);
        }
    }
}