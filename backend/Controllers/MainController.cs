using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Security.Cryptography;
using backend.Models;
using backend.UserDataAccess;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [Route("api/main")]
    public class MainController : Controller
    {
        private readonly DBManager dbManager;
        private readonly ILogger<MainController> _logger;
        private readonly RecaptchaService _recaptchaService;
        private readonly EmailService _emailService;

        public MainController(
            ILogger<MainController> logger,
            RecaptchaService recaptchaService,
            DBManager dbManager,
            EmailService emailService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _recaptchaService = recaptchaService ?? throw new ArgumentNullException(nameof(recaptchaService));
            this.dbManager = dbManager ?? throw new ArgumentNullException(nameof(dbManager));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel registration)
        {
            try
            {
                var isHuman = await _recaptchaService.VerifyRecaptchaAsync(registration.RecaptchaToken);
                if (!isHuman)
                {
                    return BadRequest(new { message = "reCAPTCHA verification failed." });
                }

                if (string.IsNullOrEmpty(registration.Email) || string.IsNullOrEmpty(registration.Password))
                {
                    return BadRequest(new { message = "Email and password are required." });
                }

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

                string token = Guid.NewGuid().ToString();

                using (var dbInsert = dbManager.connect())
                {
                    if (registration.Password.Length < 6)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, "Failed to register user; password must be at least 6 characters.");
                    }

                    var query = @$"
                        CALL create_account(
                            '{registration.FirstName}', 
                            '{registration.LastName}', 
                            '{registration.Email}', 
                            '{registration.Password}', 
                            '{registration.Role}', 
                            '{token}'
                        )";

                    if (dbManager.insert(dbInsert, query))
                    {
                        _logger.LogInformation($"User {registration.Email} registered successfully.");
                        _logger.LogInformation($"First Name: {registration.FirstName}");
                        _logger.LogInformation($"Last Name: {registration.LastName}");
                        _logger.LogInformation($"Email: {registration.Email}");
                        _logger.LogInformation($"Role: {registration.Role}");
                        _logger.LogInformation($"Token: {token}");

                        // ✅ Send the verification email
                        string verificationUrl = $"http://localhost:5172/api/main/confirm?token={token}";
                        string emailBody = $@"
                            <p>Click the link below to verify your account:</p>
                            <a href=""{verificationUrl}"">Verify My Account</a>
                        ";

                        var emailSent = await _emailService.SendEmail(registration.Email, "Verify Your Account", emailBody);
                        if (!emailSent)
                        {
                            _logger.LogError("Failed to send verification email.");
                            return StatusCode(500, new { message = "Failed to send verification email." });
                        }

                        return Ok(new { message = "User registered successfully. Verification email sent." });
                    }
                    else
                    {
                        _logger.LogError("Failed to register user; database error.");
                        return BadRequest(new { message = "Failed to register user; database error." });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while registering a new user.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to register user." });
            }
        }


        [HttpPost("send-code")]
        public async Task<IActionResult> SendVerificationCode([FromBody] EmailRequest request)
        {
            using var conn = dbManager.connect();

            string selectSql = $@"
                SELECT verified
                FROM accounts
                WHERE email = '{request.Email}'
                LIMIT 1
            ";

            var rows = dbManager.select(conn, selectSql);

            if (rows.Count == 0)
            {
                dbManager.close(conn);
                return BadRequest(new { message = "Account does not exist" });
            }

            bool isVerified = (bool)rows[0]["verified"];
            if (isVerified)
            {
                dbManager.close(conn);
                return Ok(new { message = "Account is already verified" });
            }

            bool success = await _emailService.SendVerificationCode(request.Email);

            dbManager.close(conn);

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
            using var conn = dbManager.connect();

            try
            {
                string selectSql = $@"
                    SELECT email, verified
                    FROM accounts
                    WHERE verification_token = '{token}'
                    LIMIT 1
                ";

                var rows = dbManager.select(conn, selectSql);

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

                int rowsAffected = dbManager.update(conn, updateSql);
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


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginCredentials)
        {
            try
            {
                var isHuman = await _recaptchaService.VerifyRecaptchaAsync(loginCredentials.RecaptchaToken);
                if (!isHuman)
                {
                    return BadRequest(new { message = "reCAPTCHA verification failed." });
                }

                int? userID = null;
                string? role = null;

                using (var db = dbManager.connect())
                {
                    var query = @$"SELECT * FROM check_login_credentials('{loginCredentials.Email}', '{loginCredentials.Password}')";
                    var user = dbManager.select(db, query);

                    if (user == null || user.Count == 0)
                        return Unauthorized(new { Message = "Invalid email or password" });

                    var userData = user[0];
                    _logger.LogInformation($"User with email {loginCredentials.Email} logged in.");

                    userID = (int)userData["id"] as int?;
                    role = userData["role"]?.ToString();
                }

                using (var db = dbManager.connect())
                {
                    string token = createToken();

                    string saveTokenQuery = @$"CALL add_token('{token}', {userID})";
                    var result = dbManager.select(db, saveTokenQuery);
                }

                string? hashedToken = null;
                using (var db = dbManager.connect())
                {
                    var getTokenQuery = @$"SELECT * FROM get_hashed_token({userID})";
                    var result = dbManager.select(db, getTokenQuery);

                    if (result != null && result.Count > 0)
                        hashedToken = result[0]["get_hashed_token"]?.ToString();
                }

                if (hashedToken == null)
                    return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Failed to get token" });

                return Ok(new
                {
                    Message = "Login successful",
                    Token = hashedToken,
                    UserId = userID,
                    Role = role
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred when logging in.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to login user." });
            }
        }

        public string createToken()
        {
            byte[] tokenBytes = RandomNumberGenerator.GetBytes(32);
            return Convert.ToBase64String(tokenBytes);
        }
    }
}
