import apiSlice from "./apiSlice";

export const mainApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<any, void>({
            query: () => ({
                url: "/api/posts",
                // url: "https://jsonplaceholder.typicode.com/posts",
                method: "GET",
            }),
            providesTags: ["User"],
            keepUnusedDataFor: 0,
        }),
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
    }),
});

export const {
    useGetUsersQuery,
    useAddQuestionMutation,
} = mainApi;
