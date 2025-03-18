using backend.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace backend.Services
{
    public class EmailService
    {
        private static ConcurrentDictionary<string, bool> verifiedEmails =
            new ConcurrentDictionary<string, bool>();

        private readonly EmailSettings _emailSettings;
        private static string generatedCode;
        private static string lastSentEmail;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task<bool> SendVerificationCode(string email)
        {
            generatedCode = new Random().Next(100000, 999999).ToString();
            lastSentEmail = email;

            var smtpClient = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port)
            {
                Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password),
                EnableSsl = _emailSettings.EnableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.Username),
                Subject = "Your Verification Code",
                Body = $"Your verification code is: {generatedCode}",
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);

            try
            {
                await smtpClient.SendMailAsync(mailMessage);
                Console.WriteLine("[INFO] Email was (apparently) sent without throwing an exception.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Failed to send email: {ex.Message}");
                return false;
            }
        }

        public bool VerifyCode(string email, string code)
        {
            if (IsAccountVerified(email))
            {
                return true; 
            }

            if (code == generatedCode && email == lastSentEmail)
            {
                MarkAccountAsVerified(email);
                generatedCode = null;
                lastSentEmail = null;
                return true;
            }

            return false;
        }

        public bool IsAccountVerified(string email)
        {
            return verifiedEmails.TryGetValue(email, out bool isVerified) && isVerified;
        }

        public void MarkAccountAsVerified(string email)
        {
            verifiedEmails[email] = true;
        }
    }
}
