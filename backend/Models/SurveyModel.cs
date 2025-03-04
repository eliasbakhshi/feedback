using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class SurveyModel
    {
        public int SurveyCreator { get; set; }
        public string? SurveyName { get; set; }
        public string? SurveyDescription { get; set; }
    }
}