using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.UserDataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/account")]
    public class AccountController : Controller
    {
        DBManager dbManager = new DBManager();
        private readonly ILogger<AccountController> _logger;

        public AccountController(ILogger<AccountController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetUser([FromBody] UserModel userModel)
        {
            try
            {
                var db = dbManager.connect();
                var query = $"SELECT * FROM accounts where id = {userModel.Id};";
                var result = dbManager.select(db, query);
                dbManager.close(db);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching user data.");
                return StatusCode(500, "Failed to fetch user data.");
            }
        }

        [HttpGet("test")]
        public IActionResult Index()
        {   
            Console.WriteLine("Test route.");
            return Ok();
        }
    }
}