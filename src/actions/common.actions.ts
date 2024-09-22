"use server";

import { redirect, type RedirectType } from "next/navigation";

/**
 * Intercept Route 강제이동 용
 * @param uri
 * @param type
 */
export async function forceRedirect(uri: string, type: string = "replace") {
  redirect(uri, type as RedirectType);
}
