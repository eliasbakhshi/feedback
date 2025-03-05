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
        public IActionResult CreateSurvey([FromBody] SurveyCreationModel surveyModel)
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

        [HttpPost("add-question")]
        public IActionResult AddQuestion([FromBody] QuestionCreationModel questionModel)
        {
            var db = dbManager.connect();
            var query = @$"CALL add_question('{questionModel.SurveyId}', '{questionModel.QuestionText}');";
            if (dbManager.insert(db, query))
            {
                _logger.LogInformation($"Question {questionModel.QuestionText} added successfully.");
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to add question; database error.");
            }
            dbManager.close(db);

            return Ok(new { message = "Question added successfully." });
        }
    }
}