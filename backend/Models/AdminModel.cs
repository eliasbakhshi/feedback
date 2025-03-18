using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
        public class UpdateRequest
        {
                public int UserId { get; set; }
                public string? CurrentPassword { get; set; }
                public string? NewPassword { get; set; }
                public string? NewFirstName { get; set; }
                public string? NewLastName { get; set; }
                public string? NewRole { get; set; }
                public string? NewEmail { get; set; }
        }
        public class AdminRegistrationModel
        {
                public string? FirstName { get; set; }
                public string? LastName { get; set; }
                public string? Email { get; set; }
                public string? Password { get; set; }
                public string? Role { get; set; }
        }
}
