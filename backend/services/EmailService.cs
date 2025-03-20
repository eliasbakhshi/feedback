using backend.Models;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using backend.UserDataAccess;
using Microsoft.Extensions.Logging;


namespace backend.Services
{
    public class EmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly DBManager _dbManager;
        private readonly ILogger<EmailService> _logger;
        
        public EmailService(
            IOptions<EmailSettings> emailSettings,
            DBManager dbManager,
            ILogger<EmailService> logger) 
        {
            _emailSettings = emailSettings.Value;
            _dbManager = dbManager;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<bool> SendEmail(string toEmail, string subject, string body)
        {
            _logger.LogInformation("Attempting to send email:");
            _logger.LogInformation($"To: {toEmail}");
            _logger.LogInformation($"Subject: {subject}");
            _logger.LogInformation($"Body: {body}");
            _logger.LogInformation($"SMTP Server: {_emailSettings.SmtpServer}");
            _logger.LogInformation($"Port: {_emailSettings.Port}");
            _logger.LogInformation($"Username: {_emailSettings.Username}");
            _logger.LogInformation($"EnableSsl: {_emailSettings.EnableSsl}");

            using (var smtpClient = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port))
            {
                smtpClient.Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password);
                smtpClient.EnableSsl = _emailSettings.EnableSsl;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.Username),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                try
                {
                    await smtpClient.SendMailAsync(mailMessage);
                    _logger.LogInformation($"[SUCCESS] Email sent to {toEmail} successfully.");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[ERROR] Failed to send email: {ex.Message}");
                    return false;
                }
            }
        }

        public async Task<bool> SendVerificationCode(string email)
        {
            var verificationCode = new Random().Next(100000, 999999).ToString();
            var verificationToken = Guid.NewGuid().ToString();

            using (var dbConnection = _dbManager.connect())
            {
                var updateQuery = $@"
                    UPDATE accounts
                    SET verification_code = '{verificationCode}', 
                        verification_token = '{verificationToken}'
                    WHERE email = '{email}'";

                var rowsAffected = _dbManager.update(dbConnection, updateQuery);
                if (rowsAffected == 0)
                {
                    Console.WriteLine("[ERROR] Failed to store verification code.");
                    return false;
                }
            }

            string emailBody = $@"
                <p>Your verification code is: <b>{verificationCode}</b></p>
                <p>Or click the link below to verify your account:</p>
                <a href=""https://myapp.com/api/verify/confirm?token={verificationToken}"">Verify My Account</a>
            ";

            return await SendEmail(email, "Your Verification Code", emailBody);
        }

    }
}
