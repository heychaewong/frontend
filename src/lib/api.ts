import axios from "axios";
import { Post, PostDetail } from "@/types/post";
import { User, TokenResponse } from "@/types/auth";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 예시: 게시글 목록 조회
export const fetchPosts = async () : Promise<Post[]> => {
    const res = await api.get("/posts");
    return res.data;
};

export const fetchPost = async(id: string) : Promise<PostDetail> => {
    const res = await api.get(`/posts/${id}`);
    return res.data;
};

export const createPost = async (data: { title: string; content: string}) => {
    const res = await api.post("/posts", data);
    return res.data;
};

export const deletePost = async(id: string) => {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
};

export const toggleLike = async(id: string) => {
    const res = await api.patch(`/posts/${id}/like`);
    return res.data;
};

export const createComment = async(id: string, data: {content: string}) => {
    const res = await api.post(`/posts/${id}/comments`, data);
    return res.data;
};

export const deleteComment = async(commentId: string) => {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
};

export const register = async() => {
    const res = await api.post(`/auth/register`);
    return res.data;
};

export const login = async() => {
    const res = await api.post(`/auth/login`);
    return res.data;
};

export const getMe = async() => {
    const res = await api.get(`/auth/me`);
    return res.data;
};