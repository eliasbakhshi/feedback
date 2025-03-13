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
        updateName: builder.mutation<any, {UserId: string; NewName: string}>({
            query: (userData) => ({
                url: "/api/user/update-name",
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
    useUpdateNameMutation,
    useLoginMutation,
    // useCreateUserMutation,
} = mainApi;
