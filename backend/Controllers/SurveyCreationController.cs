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
            try {
                using (var db = dbManager.connect())
                {
                    var query = @$"CALL create_survey('{surveyModel.SurveyCreator}', '{surveyModel.SurveyName}', '{surveyModel.SurveyDescription}');";
                    dbManager.insert(db, query);

                    var surveyIdQuery = @$"SELECT id FROM surveys WHERE title = '{surveyModel.SurveyName}';";
                    var surveyData = dbManager.select(db, surveyIdQuery);
                    
                    _logger.LogInformation($"Survey {surveyModel.SurveyName} created successfully.");

                    return Ok(new 
                    { 
                        message = "Survey created successfully.",
                        surveyId = surveyData[0]["id"]
                    });
                
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when creating survey.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to create survey." });
            }

        }

        [HttpPost("add-question")]
        public IActionResult AddQuestion([FromBody] QuestionCreationModel questionCreationModel)
        {
            try {
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
                        return StatusCode(StatusCodes.Status400BadRequest, new { message = "Failed to add question; database error." });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when adding question.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to add question." });
            }

        }

        [HttpDelete("delete-question")]
        public IActionResult DeleteQuestion([FromQuery] int questionId)
        {
            try {
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
                        return StatusCode(StatusCodes.Status400BadRequest, new { message = "Failed to delete question; database error."});
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when deleting question.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to delete question." });
            }
        }

        [HttpGet("get-survey-questions")]
        public IActionResult GetSurveyQuestions([FromQuery] int surveyId)
        {
            try {
                using (var db = dbManager.connect())
                {
                    var query = @$"SELECT * FROM questions WHERE survey_id = '{surveyId}';";
                    var result = dbManager.select(db, query);
                    if (result.Count == 0)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, new { message = "Failed to retrieve questions; no questions found." });
                    }
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when retrieving questions.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to retrieve questions." });
            }
        }
    }
}