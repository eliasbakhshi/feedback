using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class UpdatePasswordRequest
    {
        public string? NewPassword { get; set; }
        public int UserId { get; set; }
    }
}