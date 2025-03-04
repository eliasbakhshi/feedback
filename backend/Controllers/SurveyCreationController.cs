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

namespace FeedbackBackend.Controllers
{
    [Route("api/survey")]
    public class SurveyCreationController : Controller
    {
        DBManager dBManager = new DBManager();
        private readonly ILogger<SurveyCreationController> _logger;

        public SurveyCreationController(ILogger<SurveyCreationController> logger)
        {
            _logger = logger;
        }

        [HttpPost("create-survey")]
        public IActionResult CreateSurvey([FromBody] string? surveyTitle)
        {
            var db = dBManager.connect();

            return Ok();
        }
    }
}