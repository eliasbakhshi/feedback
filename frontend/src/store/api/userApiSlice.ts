import apiSlice from "./apiSlice";

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

        // createUser: builder.mutation<any, any>({
        //   query: (info) => ({
        //     url: "/api/users",
        //     method: "POST",
        //     body: info,
        //   }),
        //   invalidatesTags: ["User"],
        // }),
    }),
});

export const {
    useGetUsersQuery,
    useRegisterUserMutation,
    useGetAccountInfoQuery,
    useUpdatePasswordMutation,
    useUpdateFirstNameMutation,
    useUpdateLastNameMutation,
    useLoginMutation,
    // useCreateUserMutation,
} = mainApi;
