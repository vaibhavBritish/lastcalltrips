import { createSlice } from "@reduxjs/toolkit";

interface Blog {
    id: string;
    title: string,
    description: string,
    content: string,
    image:string[],
    slug: string,
    author: string,
    tags: string[],
    createdAt: Date,
    updatedAt: Date,
    isPublished: Boolean
}

interface BlogState {
    blogs: Blog[];
}

const initialState: BlogState = {
    blogs: [],
};

const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        setBlogs: (state, action) => {
            state.blogs = action.payload;
        },
        addBlogs: (state, action) => {
            state.blogs.push(action.payload);
        },
        updateBlog: (state, action) => {
            const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
            if (index !== -1) {
                state.blogs[index] = action.payload;
            }
        },
        deleteBlog: (state, action) => {
            state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
        },
    }
});

export const { setBlogs, addBlogs, deleteBlog, updateBlog } = blogSlice.actions;
export default blogSlice.reducer;