"use server";

import { signIn, signOut } from "@/auth";

type SignInParams = {
  email?: string;
  password?: string;
  type: string;
  currentUrl?: string;
};

export async function SignInAction(params: SignInParams) {
  const { email, password, type } = params;
  if (type != "credentials") {
    await signIn(type, { redirect: true, redirectTo: "/" });
  } else {
    await signIn(type, { email, password, redirect: true, redirectTo: "/" });
  }
}

export async function SignOutAction() {
  await signOut({ redirect: true, redirectTo: "/" });
}
