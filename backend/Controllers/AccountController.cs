using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using backend.UserDataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/account")]
    public class AccountController : Controller
    {
        DBManager db = new DBManager();
        private readonly ILogger<AccountController> _logger;

        public AccountController(ILogger<AccountController> logger)
        {
            _logger = logger;
        }

        [HttpGet("test")]
        public IActionResult Index()
        {   
            Console.WriteLine("Test route.");
            return Ok();
        }
    }
}