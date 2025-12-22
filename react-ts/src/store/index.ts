import {configureStore} from "@reduxjs/toolkit";
import { apiAuth } from "../services/apiAuth.ts";

export const store = configureStore({
    reducer: {
        [apiAuth.reducerPath]: apiAuth.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiAuth.middleware),
})