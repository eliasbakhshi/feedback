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
        DBManager dbManager = new DBManager();
        private readonly ILogger<SurveyCreationController> _logger;

        public SurveyCreationController(ILogger<SurveyCreationController> logger)
        {
            _logger = logger;
        }

        [HttpPost("create-survey")]
        public IActionResult CreateSurvey([FromBody] SurveyModel surveyModel)
        {
            var db = dbManager.connect();
            var query = @$"CALL create_survey('{surveyModel.SurveyCreator}', '{surveyModel.SurveyName}', '{surveyModel.SurveyDescription}');";
            if (dbManager.insert(db, query))
            {
                _logger.LogInformation($"Survey {surveyModel.SurveyName} created successfully.");
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to create survey; database error.");
            }
            dbManager.close(db);


            return Ok(new { message = "Survey created successfully." });
        }
    }
}