import { createApi } from "@reduxjs/toolkit/query/react";
import { serverBaseQuery } from "../utils/fetchBaseQuery";
import type { AuthRegisterModel } from "../types/auth/AuthRegisterModel";
import { serialize } from "object-to-formdata";
import type { AuthLoginModel } from "../types/auth/AuthLoginModel";
import type { AuthItemModel } from "../types/auth/AuthItemModel";
import type { AuthForgotPasswordRequest } from "../types/auth/AuthForgotPasswordRequest";
import type { AuthResetPasswordRequest } from "../types/auth/AuthResetPasswordRequest";

interface IAuthResponse {
    refresh: string | null;
    access: string | null;
}


export const apiAuth = createApi({
    reducerPath: "apiAuth",
    baseQuery: serverBaseQuery("users"),
    endpoints: (builder) => ({
        register: builder.mutation<IAuthResponse, AuthRegisterModel>({
            query: (model) => {
                try {
                    const formData = serialize(model);
                    return {
                        method: "POST",
                        url: "register/",
                        body: formData
                    };
                } catch {
                    throw new Error("Помилка реєстрації");
                }
            }
        }),
        login: builder.mutation<IAuthResponse, AuthLoginModel>({
            query: (model) => {
               try {
                    const formData = serialize(model);
                    return {
                        method: "POST",
                        url: "login/",
                        body: formData
                    };
                } catch {
                    throw new Error("Помилка входу");
                }
            }
        }),
        getUserInfo: builder.mutation<AuthItemModel, number>({
            query: (id) => ({
                method: "GET",
                url: `${id}/`
            })
        }),
        forgotPassword: builder.mutation<void, AuthForgotPasswordRequest>({
            query: (model) => ({
                method: "POST",
                url: "forgot-password/",
                body: model
            })
        }),
        resetPassword : builder.mutation<void, AuthResetPasswordRequest>({
            query: (model) => ({
                method: "POST",
                url: "reset-password/",
                body: model
            })
        })
    })
})

export const { 
    useRegisterMutation,
    useLoginMutation,
    useGetUserInfoMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation
} = apiAuth;