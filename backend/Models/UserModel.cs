using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class SurveyCreationModel
    {
        public int SurveyCreator { get; set; }
        public string? SurveyName { get; set; }
        public string? SurveyDescription { get; set; }
    }

    public class QuestionCreationModel
    {
        public int SurveyId { get; set; }
        public string? QuestionText { get; set; }
        public string? AnswerType { get; set; }
    }
}