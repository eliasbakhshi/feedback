// filepath: /e:/projects/feedback/backend/Models/RegistrationModel.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class RegistrationModel
    {
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; } = "operator";
        public required string RecaptchaToken { get; set; }
    }
}
