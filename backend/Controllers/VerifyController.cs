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

        public VerifyController(EmailService emailService)
        {
            _emailService = emailService;
            _dbManager = new DBManager(); 
        }

        [HttpPost("send-code")]
        public async Task<IActionResult> SendVerificationCode([FromBody] EmailRequest request)
        {
            using NpgsqlConnection conn = _dbManager.connect();

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

        [HttpPost("verify-code")]
        public IActionResult VerifyCode([FromBody] VerificationRequest request)
        {

            using NpgsqlConnection conn = _dbManager.connect();

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
                return BadRequest(new { message = "No account found with this email" });
            }

            bool isVerified = (bool)rows[0]["verified"];
            if (isVerified)
            {
                _dbManager.close(conn);
                return Ok(new { message = "Account is already verified" });
            }

            bool isValidCode = _emailService.VerifyCode(request.Email, request.Code);

            if (!isValidCode)
            {
                _dbManager.close(conn);
                return BadRequest(new { message = "Invalid code or email" });
            }


            _dbManager.close(conn);


            using NpgsqlConnection conn2 = _dbManager.connect();

            string updateSql = $@"
                UPDATE accounts
                SET verified = TRUE
                WHERE email = '{request.Email}'
            ";
            int rowsAffected = _dbManager.update(conn2, updateSql);

            _dbManager.close(conn2);

            if (rowsAffected > 0)
            {
                return Ok(new { message = "Account verified successfully" });
            }
            else
            {
                return BadRequest(new { message = "Failed to update account as verified" });
            }
        }
    }
}
