import { createApi } from "@reduxjs/toolkit/query/react";
import { serverBaseQuery } from "../utils/fetchBaseQuery";
import type { AuthRegisterModel } from "../types/auth/AuthRegisterModel";
import { serialize } from "object-to-formdata";

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
        })
    })
})

export const { 
    useRegisterMutation
} = apiAuth;