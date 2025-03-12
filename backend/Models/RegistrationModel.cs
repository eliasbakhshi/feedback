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
        public required string RecaptchaToken { get; set; }
    }
}
