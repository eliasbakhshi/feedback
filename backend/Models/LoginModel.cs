using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class LoginModel
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string RecaptchaToken { get; set; }
    }
}
