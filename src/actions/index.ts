"use server";

import { redirect, type RedirectType } from "next/navigation";

/**
 * Intercept Route 강제이동 용
 * @param uri
 * @param type
 */
export async function forceRedirect(uri: string, type: string = "push") {
  redirect(uri, type as RedirectType);
}

export async function checkFormData(formData: FormData, keys: string[]) {
  keys.forEach((key) => {
    if (!formData.get(key)) {
      throw new Error(`${key} is required`);
    }
  });
}

export async function checkParams(
  params: { [key: string]: any },
  keys: string[],
) {
  keys.forEach((key) => {
    if (!params[key]) {
      throw new Error(`${key} is required`);
    }
  });
}
