using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class SurveyModel
    {
        public int SurveyId { get; set; }
        public int SurveyCreator { get; set; }
        public string? SurveyName { get; set; }
        public string? SurveyDescription { get; set; }
    }

    public class QuestionModel
    {
        public int QuestionId { get; set; }
        public int SurveyId { get; set; }
        public string? QuestionText { get; set; }
        public string? AnswerType { get; set; }
    }
}