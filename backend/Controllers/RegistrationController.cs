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
using Npgsql;

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
                var db = dbManager.connect();

                string checkEmail = $"SELECT COUNT(*) FROM accounts WHERE email = '{registration.Email}';";
                using (var check = new NpgsqlCommand(checkEmail, db))
                {
                    bool exists = (long)check.ExecuteScalar() > 0; 

                    if (exists)
                    {
                        dbManager.close(db);
                        return StatusCode(StatusCodes.Status400BadRequest, "User already exists.");
                    }
                }

                var query = @$"CALL create_account('{registration.FullName}', '{registration.Email}', '{registration.Password}', '{registration.Role}')";
                
                if (dbManager.insert(db, query))
                {
                    dbManager.close(db);
                    _logger.LogInformation($"User {registration.Email} registered successfully.");
                    return Ok("User registered successfully.");
                }
                else
                {
                    dbManager.close(db);
                    return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; database error.");
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