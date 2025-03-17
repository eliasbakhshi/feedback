import apiSlice from "./apiSlice";

export const mainApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addSurvey: builder.mutation<any, { SurveyCreator: string; SurveyName: string; SurveyDescription: string }>({
            query: (surveyData) => ({
                url: "/api/survey/create-survey",
                method: "POST",
                body: surveyData,
                headers: { "Content-Type": "application/json" } 
            }),
            invalidatesTags: ["User"],
        }),
        addQuestion: builder.mutation<any, { SurveyId: number; QuestionText: string; AnswerType: string }>({
            query: (surveyData) => ({
                url: "/api/survey/add-question",
                method: "POST",
                body: surveyData,
                headers: { "Content-Type": "application/json" } 
            }),
            invalidatesTags: ["Question"],
        }),
        deleteQuestion: builder.mutation<any, { QuestionId: number }>({
            query: ({ QuestionId }) => ({
                url: `/api/survey/delete-question?questionId=${QuestionId}`,
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            }),
            invalidatesTags: ["Question"],
        }),
        getSurveyQuestions: builder.query<any, { SurveyId: number }>({
            query: ({ SurveyId }) => ({
                url: `/api/survey/get-survey-questions?surveyId=${SurveyId}`,
                method: "GET",
            }),
            providesTags: ["Question"],
        }),
    }),
});

export const {
    useAddSurveyMutation,
    useAddQuestionMutation,
    useDeleteQuestionMutation,
    useGetSurveyQuestionsQuery,
} = mainApi;
