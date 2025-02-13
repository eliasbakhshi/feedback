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
        registerUser: builder.mutation<any, {username: string; fullname: string; email: string; password: string;}>({
            query: (userData) => ({
                url: "http://localhost:5172/api/registration",
                method: "POST",
                body: userData,
                headers: { "Content-Type": "application/json" } 
            }),
            invalidatesTags: ["User"],

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
    // useCreateUserMutation,
} = mainApi;
