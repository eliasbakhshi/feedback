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
            var db = dbManager.connect();
            var query = @$"INSERT INTO account (name, email, password, role) 
                        VALUES ('{registration.Username}', '{registration.Email}', crypt('{registration.Password}', gen_salt('bf')), '{registration.Role}')";
            dbManager.insert(db, query);
            dbManager.close(db);

            return Ok();
        }
    }
}