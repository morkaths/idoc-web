"use server";

import { signIn } from "@/auth";
import { AuthApi } from "@/apis/auth.api";
import { User } from "@/types";

export async function handleGoogleLogin() {
    await signIn("google", { redirectTo: "/?login=google" });
}

export async function handleCredentialsLogin(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if ((error as Error).message.includes("CredentialsSignin")) {
            return { error: "Invalid credentials" };
        }
        throw error;
    }
}

export async function handleRegister(formData: FormData) {
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
        const result = await AuthApi.register({
            email,
            username,
            password
        });

        if (result) {
            return { success: true };
        }
        return { error: "Registration failed" };
    } catch (error) {
        return { error: (error as Error).message || "Registration failed" };
    }
}

export async function updateUser(data: Partial<User>) {
    try {
        const result = await AuthApi.update(data);
        if (result) {
            return { success: true, data: result };
        }
        return { error: "Update failed" };
    } catch (error) {
        return { error: (error as Error).message || "Update failed" };
    }
}
