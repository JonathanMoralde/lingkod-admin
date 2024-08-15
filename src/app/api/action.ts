"use server";

import { loginSchema } from "@/models/loginSchema";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";

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
    await signInWithEmailAndPassword(
      auth,
      parsed.data.email,
      parsed.data.password
    );

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
