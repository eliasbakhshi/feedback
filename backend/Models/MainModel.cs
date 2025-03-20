// filepath: /e:/projects/feedback/backend/Models/RegistrationModel.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class RegistrationModel
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; } = "operator";
        public string? RecaptchaToken { get; set; }
    }

    public class LoginModel
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string RecaptchaToken { get; set; }
    }

    public class VerificationRequest
    {
        public string? Email { get; set; }
        public string? Code { get; set; }
    }

    public class EmailSettings
    {
        public string? SmtpServer { get; set; }
        public int Port { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public bool EnableSsl { get; set; } 
    }

    public class EmailRequest
    {
        public string? Email { get; set; }
    }
}
