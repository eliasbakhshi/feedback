using backend.Models;
using backend.Services;
using backend.UserDataAccess;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/verify")]
    public class VerifyController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly DBManager _dbManager;

        public VerifyController(EmailService emailService, DBManager dbManager)
        {
            _emailService = emailService;
            _dbManager = dbManager;
        }


        [HttpPost("send-code")]
        public async Task<IActionResult> SendVerificationCode([FromBody] EmailRequest request)
        {
            using var conn = _dbManager.connect();

            string selectSql = $@"
                SELECT verified
                FROM accounts
                WHERE email = '{request.Email}'
                LIMIT 1
            ";

            var rows = _dbManager.select(conn, selectSql);

            if (rows.Count == 0)
            {
                _dbManager.close(conn);
                return BadRequest(new { message = "Account does not exist" });
            }

            bool isVerified = (bool)rows[0]["verified"];
            if (isVerified)
            {
                _dbManager.close(conn);
                return Ok(new { message = "Account is already verified" });
            }

            bool success = await _emailService.SendVerificationCode(request.Email);

            _dbManager.close(conn);

            if (success)
            {
                return Ok(new { message = "Verification code sent successfully" });
            }
            else
            {
                return StatusCode(500, new { message = "Failed to send verification code" });
            }
        }


        [HttpGet("confirm")]
        public IActionResult ConfirmAccount(string token)
        {
            using var conn = _dbManager.connect();

            try
            {
                string selectSql = $@"
                    SELECT email, verified
                    FROM accounts
                    WHERE verification_token = '{token}'
                    LIMIT 1
                ";

                var rows = _dbManager.select(conn, selectSql);

                if (rows.Count == 0)
                {
                    return BadRequest(new { message = "Invalid or expired token." });
                }

                bool isVerified = (bool)rows[0]["verified"];
                if (isVerified)
                {
                    return Ok(new { message = "Account is already verified." });
                }

                string updateSql = $@"
                    UPDATE accounts
                    SET verified = TRUE,
                        verification_token = NULL
                    WHERE verification_token = '{token}'
                ";

                int rowsAffected = _dbManager.update(conn, updateSql);
                conn.Close(); 

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Account verified successfully." });
                }
                else
                {
                    return BadRequest(new { message = "Failed to verify account." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Failed to verify account: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error." });
            }
            finally
            {
                conn.Close();
            }
        }
    }
}
