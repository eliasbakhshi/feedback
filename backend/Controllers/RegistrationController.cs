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
    [Route("api/registration")]
    public class RegistrationController : Controller
    {   
        DBManager dbManager = new DBManager();
        private readonly ILogger<RegistrationController> _logger;

        public RegistrationController(ILogger<RegistrationController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Register([FromBody] RegistrationModel registration)
        {
            try
            {
                using (var dbCheck = dbManager.connect())
                {
                    string checkEmail = $"SELECT COUNT(*) FROM accounts WHERE email = '{registration.Email}';";
                    var check = dbManager.select(dbCheck, checkEmail);
                    var result = check.FirstOrDefault()?["count"] as long?;
                    bool exists = result.HasValue && result.Value > 0;

                    if (exists)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; user already exists.");
                    }
                }

                using (var dbInsert = dbManager.connect())
                {
                    var query = @$"CALL create_account('{registration.FullName}', '{registration.Email}', '{registration.Password}', '{registration.Role}')";
                    
                    if (dbManager.insert(dbInsert, query))
                    {
                        _logger.LogInformation($"User {registration.Email} registered successfully.");
                        return Ok("User registered successfully.");
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; database error.");
                    }
                }
            }
            catch (NullReferenceException ex)
            {
                _logger.LogError(ex, "An error occurred while registering a new user.");
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; missing arguments.");
            }
        }
    }
}