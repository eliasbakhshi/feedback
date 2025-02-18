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

        [HttpGet("user/{id}")]
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
                return Ok("Password updated successfully.");
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

        [HttpPut("update-name")]
        public IActionResult UpdateName([FromBody] UpdateRequest updateNameRequest)
        {
            try
            {
                var db = dbManager.connect();
                var query = $"UPDATE accounts SET fullname = '{updateNameRequest.NewName}' WHERE id = {updateNameRequest.UserId};";

                int affectedRows = dbManager.update(db, query);
                dbManager.close(db);

                if (affectedRows == 0)
                {
                    return NotFound("User not found.");
                }

                _logger.LogInformation($"User with ID {updateNameRequest.UserId} updated name to {updateNameRequest.NewName}.");
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
    }
}