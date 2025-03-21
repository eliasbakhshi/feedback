import apiSlice from "./apiSlice";
import Cookies from "js-cookie";
const token = Cookies.get("token");
export const mainApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<any, void>({
            query: () => ({
                url: "https://jsonplaceholder.typicode.com/posts",
                method: "GET",
            }),
            providesTags: ["User"],
            keepUnusedDataFor: 0,
        }),
        registerUser: builder.mutation<any, {firstName: string; lastName: string; email: string; password: string;}>({
            query: (userData) => ({
                url: "/api/main/register",
                method: "POST",
                body: userData,
                headers: { "Content-Type": "application/json" } 
            }),
            invalidatesTags: ["User"],

        }),
        confirmUser: builder.mutation<any, { token: string }>({
            query: ({ token }) => ({
                url: `/api/main/confirm?token=${token}`,
                method: "POST",
                headers: { "Content-Type": "application/json" }
            }),
        }),
        getAccountInfo: builder.query<any, number>({
            query: (id) => ({
                url: `/api/user/${id}`,
                method: "GET",
                headers: { "Content-Type": "application/json" } 
            }),
            providesTags: ["User"],
        }),
        updatePassword: builder.mutation<any, { UserId: string; CurrentPassword: string; NewPassword: string }>({
            query: (userData) => ({
                url: "/api/user/update-password",
                method: "PUT",
                body: userData,
                headers: { "Content-Type": "application/json" } 
            }),
            invalidatesTags: ["User"],
        }),
        updateFirstName: builder.mutation<any, {UserId: string; newFirstName: string}>({
            query: (userData) => ({
                url: "/api/user/update-first-name",
                method: "PUT",
                body: userData,
                headers: { "Content-Type": "application/json" } 
            }),
            invalidatesTags: ["User"],
        }),
        updateLastName: builder.mutation<any, {UserId: string; newLastName: string}>({
            query: (userData) => ({
                url: "/api/user/update-last-name",
                method: "PUT",
                body: userData,
                headers: { "Content-Type": "application/json" } 
            }),
            invalidatesTags: ["User"],
        }),
        login: builder.mutation<any, {email: string; password: string}>({
            query: (userData) => ({
              url: "/api/main/login",
              method: "POST",
              body: userData,
            }),
          }),
          // SURVEY
        addSurvey: builder.mutation<any, { SurveyCreator: number; SurveyName: string; SurveyDescription: string }>({
            query: (surveyData) => ({
                url: "/api/user/survey/create-survey",
                method: "POST",
                body: surveyData,
                headers: { "Content-Type": "application/json" } 
            }),
        invalidatesTags: ["User"],
        }),
        addQuestion: builder.mutation<any, { SurveyId: number; QuestionText: string; AnswerType: string }>({
            query: (surveyData) => ({
                url: "/api/user/survey/add-question",
                method: "POST",
                body: surveyData,
                headers: { "Content-Type": "application/json" } 
            }),
            invalidatesTags: ["Question"],
        }),
        deleteQuestion: builder.mutation<any, { QuestionId: number }>({
            query: ({ QuestionId }) => ({
                url: `/api/user/survey/delete-question?questionId=${QuestionId}`,
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            }),
            invalidatesTags: ["Question"],
        }),
        getSurveyQuestions: builder.query<any, { SurveyId: number }>({
            query: ({ SurveyId }) => ({
                url: `/api/user/survey/get-survey-questions?surveyId=${SurveyId}`,
                method: "GET",
            }),
            providesTags: ["Question"],
        }),
        editQuestion: builder.mutation<any, { QuestionText: string; QuestionId: number; }>({
            query: (surveyData) => ({
                url: "/api/user/survey/edit-question",
                method: "PUT",
                body: surveyData,
                headers: { "Content-Type": "application/json" }
            }),
            invalidatesTags: ["Question"],
        }),
        getSurveys: builder.query<any, { userId: number }>({
            query: ({ userId }) => ({
                url: `/api/user/survey/get-surveys?userId=${userId}`,
                method: "GET",
                headers: { Authorization: token },
            }),
            providesTags: ["Question"],
        }),
        getSurveyInformation: builder.query<any, { SurveyId: number; userId: number }>({
            query: ({ SurveyId, userId }) => ({
                url: `/api/user/survey/get-survey-information?surveyId=${SurveyId}&userId=${userId}`,
                method: "GET",
            }),
            providesTags: ["Question"],
        }),
        editSurvey: builder.mutation<any, { SurveyId: number; SurveyName: string; SurveyDescription: string }>({
            query: (surveyData) => ({
                url: "/api/user/survey/edit-survey",
                method: "PUT",
                body: surveyData,
                headers: { "Content-Type": "application/json" }
            }),
            invalidatesTags: ["Question"],
        }),
        deleteSurvey: builder.mutation<any, { SurveyId: number }>({
            query: ({ SurveyId }) => ({
                url: `/api/user/survey/delete-survey?SurveyId=${SurveyId}`,
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
        }),
        invalidatesTags: ["Question"],
        }),
    }),
 });

export const {
    useGetUsersQuery,
    useRegisterUserMutation,
    useConfirmUserMutation,
    useGetAccountInfoQuery,
    useUpdatePasswordMutation,
    useUpdateFirstNameMutation,
    useUpdateLastNameMutation,
    useLoginMutation,
    useAddSurveyMutation,
    useAddQuestionMutation,
    useDeleteQuestionMutation,
    useGetSurveyQuestionsQuery,
    useGetSurveysQuery,
    useDeleteSurveyMutation,
    useGetSurveyInformationQuery,
    useEditSurveyMutation,
    useEditQuestionMutation,
} = mainApi;
