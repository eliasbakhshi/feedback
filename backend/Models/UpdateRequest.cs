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
    }
}