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
    [Route("api/admin")]
    public class AdminController : Controller
    {
        DBManager dbManager = new DBManager();
        private readonly ILogger<AdminController> _logger;

        public AdminController(ILogger<AdminController> logger)
        {
            _logger = logger;
        }

        [HttpPut("update-password")]
        public IActionResult UpdatePassword([FromBody] UpdateRequest updatePasswordRequest)
        {
            try
            {
                using (var db = dbManager.connect())
                {
                    var query = $"UPDATE accounts SET password = crypt('{updatePasswordRequest.NewPassword}', gen_salt('bf')) WHERE id = {updatePasswordRequest.UserId};";

                    int affectedRows = dbManager.update(db, query);
                    dbManager.close(db);

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
                using (var db = dbManager.connect())
                {
                    var query = $"UPDATE accounts SET firstname = '{updateNameRequest.NewFirstName}' WHERE id = {updateNameRequest.UserId};";

                    int affectedRows = dbManager.update(db, query);
                    dbManager.close(db);

                    if (affectedRows == 0)
                    {
                        return NotFound("User not found.");
                    }
                }

                _logger.LogInformation($"User with ID {updateNameRequest.UserId} updated name to {updateNameRequest.NewFirstName}.");
                return Ok(new { message = "Name updated successfully."});
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
                using (var db = dbManager.connect())
                {
                    var query = $"UPDATE accounts SET lastname = '{updateNameRequest.NewLastName}' WHERE id = {updateNameRequest.UserId};";

                    int affectedRows = dbManager.update(db, query);
                    dbManager.close(db);

                    if (affectedRows == 0)
                    {
                        return NotFound("User not found.");
                    }
                }

                _logger.LogInformation($"User with ID {updateNameRequest.UserId} updated name to {updateNameRequest.NewLastName}.");
                return Ok(new { message = "Name updated successfully."});
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

        [HttpPut("update-role")]
        public IActionResult UpdateRole([FromBody] UpdateRequest updateRoleRequest)
        {
            try
            {
                using (var db = dbManager.connect())
                {
                    var query = $"UPDATE accounts SET role = '{updateRoleRequest.NewRole}' WHERE id = {updateRoleRequest.UserId};";

                    int affectedRows = dbManager.update(db, query);
                    dbManager.close(db);

                    if (affectedRows == 0)
                    {
                        return NotFound("User not found.");
                    }
                }

                _logger.LogInformation($"User with ID {updateRoleRequest.UserId} updated role to {updateRoleRequest.NewRole}.");
                return Ok(new { message = "Role updated successfully."});
            }
            catch (NullReferenceException ex)
            {
                _logger.LogError(ex, "An error occurred while updating user role.");
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; database error.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating user role.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update user role.");
            }
        }

        [HttpPut("update-email")]
        public IActionResult UpdateEmail([FromBody] UpdateRequest updateEmailRequest)
        {
            try
            {
                using (var db = dbManager.connect())
                {
                    var query = $"UPDATE accounts SET email = '{updateEmailRequest.NewEmail}' WHERE id = {updateEmailRequest.UserId};";

                    int affectedRows = dbManager.update(db, query);
                    dbManager.close(db);

                    if (affectedRows == 0)
                    {
                        return NotFound("User not found.");
                    }
                }

                _logger.LogInformation($"User with ID {updateEmailRequest.UserId} updated email to {updateEmailRequest.NewEmail}.");
                return Ok(new { message = "Email updated successfully."});
            }
            catch (NullReferenceException ex)
            {
                _logger.LogError(ex, "An error occurred while updating user email.");
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; database error.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating user email.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update user email.");
            }
        }
    }
}