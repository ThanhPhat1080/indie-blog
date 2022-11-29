import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/models/user.server";
// import { v2 as cloudinary } from 'cloudinary';

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function validateUserName(name: unknown): name is string {
  return typeof name === "string" && name.length >= 8 && name.length <= 100;
}

export function isEmptyOrNotExist(
  param: unknown
): param is null | undefined | string | boolean | number | Object {
  if (param === null || param === undefined) {
    return true;
  }

  if (typeof param === "number") {
    return param === 0;
  }

  if (typeof param === "string") {
    return param.length === 0;
  }

  if (typeof param === "boolean") {
    return !param;
  }

  return Object.keys(param).length === 0;
}

export function convertUrlSlugFormat(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function getPathImgCloudinary(uploadResolved: any): string {
  if (isEmptyOrNotExist(uploadResolved)) {
    return "";
  }

  return `v${uploadResolved.version.toString()}/${uploadResolved.public_id.toString()}.${uploadResolved.format.toString()}`;
}

export function removeEmptyObjectProperties(object: Object): Object {
  const returnObj: Object = Object.assign({}, object);

  Object.keys(returnObj).forEach((key) => {
    const value = returnObj[key as keyof object];

    if (typeof value !== "boolean" && isEmptyOrNotExist(value)) {
      delete returnObj[key as keyof object];
    }
  });

  return returnObj;
}
