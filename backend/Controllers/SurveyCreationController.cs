using System;
using System.Collections.Generic;
using System.Data.Common;
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
            using (var db = dbManager.connect())
            {
                var query = @$"CALL create_survey('{surveyModel.SurveyCreator}', '{surveyModel.SurveyName}', '{surveyModel.SurveyDescription}');";
                if (dbManager.insert(db, query))
                {
                    _logger.LogInformation($"Survey {surveyModel.SurveyName} created successfully.");
                    return Ok(new { message = "Survey created successfully." });
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Failed to create survey; database error.");
                }
            }
        }

        [HttpPost("add-question")]
        public IActionResult AddQuestion([FromBody] QuestionCreationModel questionCreationModel)
        {
            using (var db = dbManager.connect())
            {
                var query = @$"CALL add_question('{questionCreationModel.SurveyId}', '{questionCreationModel.QuestionText}', '{questionCreationModel.AnswerType}');";
                if (dbManager.insert(db, query))
                {
                    _logger.LogInformation($"Question added successfully.");
                    return Ok(new { message = "Question added successfully." });
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Failed to add question; database error.");
                }
            }
        }

        [HttpPost("delete-question")]
        public IActionResult DeleteQuestion([FromBody] int questionId)
        {
            using (var db = dbManager.connect())
            {
                var query = @$"DELETE FROM questions WHERE id = '{questionId}';";
                if (dbManager.delete(db, query) > 0)
                {
                    _logger.LogInformation($"Question deleted successfully.");
                    return Ok(new { message = "Question deleted successfully." });
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Failed to delete question; database error.");
                }
            }
        }

        [HttpGet("get-survey-questions")]
        public IActionResult GetSurveyQuestions([FromBody] int surveyId)
        {
            using (var db = dbManager.connect())
            {
                var query = @$"SELECT * FROM questions WHERE survey_id = '{surveyId}';";
                var result = dbManager.select(db, query);
                if (result.Count == 0)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Failed to retrieve questions; no questions found.");
                }
                return Ok(result);
            }
        }
    }
}