using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.UserDataAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/login")]
    public class LoginController : Controller
    {
        DBManager dbManager = new DBManager();

        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginModel loginCredentials)
        {
            try
            {
                var db = dbManager.connect();
                var query = @$"SELECT * FROM check_login_credentials('{loginCredentials.Email}', '{loginCredentials.Password}')";

                var user = dbManager.select(db, query);

                if (user == null || user.Count == 0)
                    return Unauthorized("Invalid email or password");

                var userData = user[0];
                _logger.LogInformation($"User with email {loginCredentials.Email} logged in.");
                return Ok(new
                {
                    Message = "Login successful",
                    UserId = (int)userData["id"],
                    Role = userData["role"].ToString()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when logging in.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to login user.");
            }
        }
    }
}