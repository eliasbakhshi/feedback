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
                return Ok(new { message = "Name updated successfully." });
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
                return Ok(new { message = "Name updated successfully." });
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
                return Ok(new { message = "Role updated successfully." });
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
                return Ok(new { message = "Email updated successfully." });
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

        [HttpPut("register")]
        public IActionResult Register([FromBody] AdminRegistrationModel registration)
        {
            try
            {
                using (var dbCheck = dbManager.connect())
                {
                    string checkEmail = $"SELECT COUNT(*) FROM accounts WHERE email = '{registration.Email}';";
                    var check = dbManager.select(dbCheck, checkEmail);
                    var result = check.FirstOrDefault()?["count"] as long?;
                    bool exists = result.HasValue && result.Value > 0;

                    if (exists)
                    {
                        return BadRequest(new { message = "Failed to register user; user already exists." });
                    }
                }

                using (var dbInsert = dbManager.connect())
                {
                    if (registration.Password?.Length < 6)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; password must be at least 6 characters.");
                    }

                    var query = @$"CALL create_account('{registration.FirstName}', '{registration.LastName}', '{registration.Email}', '{registration.Password}', '{registration.Role}')";

                    if (dbManager.insert(dbInsert, query))
                    {
                        _logger.LogInformation($"User {registration.Email} registered successfully.");
                        return Ok(new { message = "User registered successfully." });
                    }
                    else
                    {
                        return BadRequest(new { message = "Failed to register user; database error." });
                    }
                }
            }
            catch (NullReferenceException ex)
            {
                _logger.LogError(ex, "An error occurred while registering a new user.");
                return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; missing arguments.");
            }
        }
        [HttpDelete("delete/{userId}")]
        public IActionResult RemoveUser(int userId)
        {
            Console.WriteLine("line:  " + userId);
            try
            {
                using (var db = dbManager.connect())
                {
                    var query = $"DELETE FROM accounts WHERE id = {userId};";

                    int affectedRows = dbManager.update(db, query);
                    dbManager.close(db);

                    if (affectedRows == 0)
                    {
                        return NotFound("User not found.");
                    }
                }

                _logger.LogInformation($"User with ID {userId} removed successfully.");
                return Ok(new { message = "User removed successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while removing user.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to remove user.");
            }
        }

        [HttpGet("all-users")]
        public IActionResult AllUsers()
        {
            try
            {
                var db = dbManager.connect();
                var query = "SELECT * FROM get_all_users();";

                var result = dbManager.select(db, query);
                dbManager.close(db);

                return Ok(result);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching all users.");
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to fetch all users.");
            }
        }
    }
}
