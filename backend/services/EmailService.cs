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
        private readonly ILogger<EmailService> _logger;
        
        public EmailService(
            IOptions<EmailSettings> emailSettings,
            ILogger<EmailService> logger) 
        {
            _emailSettings = emailSettings.Value;
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
    }
}
