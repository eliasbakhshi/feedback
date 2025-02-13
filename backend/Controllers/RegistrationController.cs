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
                var db = dbManager.connect();
                var query = @$"CALL create_account('{registration.Username}', '{registration.FullName}', '{registration.Email}', '{registration.Password}', '{registration.Role}')";
                
                if (dbManager.insert(db, query))
                {
                    dbManager.close(db);
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