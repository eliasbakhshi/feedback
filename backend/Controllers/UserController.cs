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
    [Route("api/user")]
    public class UserController : Controller
    {
        DBManager dbManager = new DBManager();

        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            try
            {
                var db = dbManager.connect();
                var query = $"SELECT * FROM accounts where id = {id};";
                var result = dbManager.select(db, query);
                dbManager.close(db);

                if (result.Count == 0)
                {
                    return NotFound("User not found.");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching user data.");
                return StatusCode(500, "Failed to fetch user data.");
            }
        }

        [HttpPut("update-password")]
        public IActionResult UpdatePassword([FromBody] UpdateRequest updatePasswordRequest)
        {
            try
            {
                if (updatePasswordRequest.CurrentPassword == updatePasswordRequest.NewPassword)
                {
                    return BadRequest("New password must be different from the current password.");
                }

                using (var dbCheck = dbManager.connect())
                {
                    var passwordQuery = $"SELECT password FROM accounts WHERE password = crypt('{updatePasswordRequest.CurrentPassword}', password);";
                    var passwordResult = dbManager.select(dbCheck, passwordQuery);
                    if (passwordResult.Count == 0)
                    {
                        return Unauthorized("Invalid password.");
                    }
                }

                using (var dbUpdate = dbManager.connect())
                {
                    var query = $"UPDATE accounts SET password = crypt('{updatePasswordRequest.NewPassword}', gen_salt('bf')) WHERE id = {updatePasswordRequest.UserId};";

                    int affectedRows = dbManager.update(dbUpdate, query);
                    dbManager.close(dbUpdate);

                    if (affectedRows == 0)
                    {
                        return NotFound("User not found.");
                    }
                }

                _logger.LogInformation($"Password updated for user with ID {updatePasswordRequest.UserId}.");
                return Ok(new { message = "Password updated successfully." });
            }
            catch (NullReferenceException ex)
            {
                _logger.LogError(ex, "An error occurred while updating user password.");
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to update password; missing arguments.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating user password.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update user password.");
            }
        }

        [HttpPut("update-first-name")]
        public IActionResult UpdateFirstName([FromBody] UpdateRequest updateNameRequest)
        {
            try
            {
                var db = dbManager.connect();
                var query = $"UPDATE accounts SET firstname = '{updateNameRequest.NewFirstName}' WHERE id = {updateNameRequest.UserId};";

                int affectedRows = dbManager.update(db, query);
                dbManager.close(db);

                if (affectedRows == 0)
                {
                    return NotFound("User not found.");
                }

                _logger.LogInformation($"User with ID {updateNameRequest.UserId} updated name to {updateNameRequest.NewFirstName}.");
                return Ok("Name updated successfully.");
            }
            catch (NullReferenceException ex)
            {
                _logger.LogError(ex, "An error occurred while updating user name.");
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; database error.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating user name.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update user name.");
            }
        }

        [HttpPut("update-last-name")]
        public IActionResult UpdateLastName([FromBody] UpdateRequest updateNameRequest)
        {
            try
            {
                var db = dbManager.connect();
                var query = $"UPDATE accounts SET lastname = '{updateNameRequest.NewLastName}' WHERE id = {updateNameRequest.UserId};";

                int affectedRows = dbManager.update(db, query);
                dbManager.close(db);

                if (affectedRows == 0)
                {
                    return NotFound("User not found.");
                }

                _logger.LogInformation($"User with ID {updateNameRequest.UserId} updated name to {updateNameRequest.NewLastName}.");
                return Ok("Name updated successfully.");
            }
            catch (NullReferenceException ex)
            {
                _logger.LogError(ex, "An error occurred while updating user name.");
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; database error.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating user name.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update user name.");
            }
        }

        [HttpPost("survey/create-survey")]
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

        [HttpPost("survey/add-question")]
        public IActionResult AddQuestion([FromBody] QuestionCreationModel questionCreationModel)
        {
            var db = dbManager.connect();
            var query = @$"CALL add_question('{questionCreationModel.SurveyId}', '{questionCreationModel.QuestionText}', '{questionCreationModel.AnswerType}');";
            if (dbManager.insert(db, query))
            {
                _logger.LogInformation($"Question added successfully.");
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to add question; database error.");
            }
            dbManager.close(db);

            return Ok(new { message = "Question added successfully." });
        }

        [HttpDelete("survey/delete-question")]
        public IActionResult DeleteQuestion([FromQuery] int questionId)
        {
            try
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
                        return StatusCode(StatusCodes.Status400BadRequest, new { message = "Failed to delete question; database error." });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when deleting question.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to delete question." });
            }
        }

        [HttpGet("survey/get-survey-questions")]
        public IActionResult GetSurveyQuestions([FromQuery] int surveyId)
        {
            try
            {
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