"use server";

import { loginSchema } from "@/models/loginSchema";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { cookies } from "next/headers"; // Import cookies utility from Next.js

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success?: boolean;
};

export async function onSubmitAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = loginSchema.safeParse(formData);

  console.log("server");
  console.log(parsed);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      parsed.data.email,
      parsed.data.password
    );

    // Get the user's ID token
    const token = await userCredential.user.getIdToken();

    // Set the token in a cookie
    const cookieStore = cookies(); // Use Next.js cookies utility
    cookieStore.set("authToken", token, {
      httpOnly: true, // Ensures the cookie is only accessible by the server
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      path: "/", // The cookie is available across the entire site
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 60 * 60 * 24 * 7, // Cookie expiry (e.g., 7 days)
    });

    return { message: "User signed in successfully", success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      const fields: Record<string, string> = {};
      for (const key of Object.keys(formData)) {
        fields[key] = formData[key].toString();
      }

      return {
        message: "An error occured while signing in",
        fields,
        issues: [error.message],
        success: false,
      };
    } else {
      console.error("Unknown error:", error);
    }
  }

  return { message: "An unknown error occurred", success: false };
}
