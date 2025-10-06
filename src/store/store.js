import { configureStore } from "@reduxjs/toolkit";
import blogSlice from "./blogSlice";
import userSlice from "./userSlice";
import dealSlice from "./dealSlice";

const store = configureStore({
    reducer: {
        blogs: blogSlice,
        users: userSlice,
        deals: dealSlice
    }
})

export default store