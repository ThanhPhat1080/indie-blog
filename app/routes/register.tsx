import { useRef, useEffect } from "react";

import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";

import { getUserId, createUserSession } from "~/session.server";
import { createUser, getUserByEmail } from "~/models/user.server";

import {
  isEmptyOrNotExist,
  safeRedirect,
  toTitleCase,
  validateEmail,
  validateUserName,
} from "~/utils";
import { AuthFormLayout } from "~/components";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }

  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  // Get values form data
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const bio = formData.get("bio") as string;
  const twitter = formData.get("twitter") as string;
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateUserName(name)) {
    return json(
      { errors: { name: "Name is invalid", email: null, password: null } },
      { status: 400 }
    );
  }

  if (!validateEmail(email)) {
    return json(
      { errors: { name: null, email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { name: null, email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      {
        errors: { name: null, email: null, password: "Password is too short" },
      },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          name: null,
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const user = await createUser({
    name: toTitleCase(name),
    email,
    password,
    bio,
    twitter,
  });

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Register() {
  const actionData = useActionData<typeof action>();

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  const transition = useTransition();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const isNameError = !isEmptyOrNotExist(actionData?.errors.name);
  const isEmailError = !isEmptyOrNotExist(actionData?.errors.email);
  const isPasswordError = !isEmptyOrNotExist(actionData?.errors.password);
  const isFormSubmission = !isEmptyOrNotExist(transition.submission);

  useEffect(function focusFormFieldError() {
    if (isNameError) {
      nameRef.current?.focus();
    }

    if (isEmailError) {
      emailRef.current?.focus();
    }

    if (isPasswordError) {
      passwordRef.current?.focus();
    }
  });

  return (
    <AuthFormLayout formName="register">
      <Form
        method="post"
        className="space-y-6 text-white"
        aria-describedby="Create user form"
        aria-details="Create user form"
      >
        <div>
          <label
            htmlFor="name"
            className="block"
          >
            Your name
          </label>
          <div className="mt-1">
            <input
              ref={nameRef}
              id="name"
              required
              autoFocus={true}
              name="name"
              minLength={8}
              maxLength={100}
              autoComplete="name"
              aria-invalid={isNameError ? true : undefined}
              aria-describedby="name-error"
              className={`w-full rounded border px-2 py-1 dark:border-gray-200 bg-white text-slate-600 dark:text-white dark:bg-slate-800 ${
                isNameError ? "border-red-500" : "border-gray-500"
              }`}
            />
            {isNameError && (
              <div className="pt-1 text-red-700" id="email-error">
                {actionData!.errors.name}
              </div>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              ref={emailRef}
              id="email"
              required
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={isEmailError ? true : undefined}
              aria-describedby="email-error"
              className={`w-full rounded border px-2 py-1 dark:border-gray-200 bg-white text-slate-600 dark:text-white dark:bg-slate-800 ${
                isEmailError ? "border-red-500" : "border-gray-500"
              }`}
            />
            {isEmailError && (
              <div className="pt-1 text-red-700" id="email-error">
                {actionData!.errors.email}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={isPasswordError ? true : undefined}
              aria-describedby="password-error"
              className={`w-full rounded border px-2 py-1 dark:border-gray-200 bg-white text-slate-600 dark:text-white dark:bg-slate-800 ${
                isPasswordError ? "border-red-500" : "border-gray-500"
              }`}
            />
            {isPasswordError && (
              <div className="pt-1 text-red-700" id="password-error">
                {actionData!.errors.password}
              </div>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="bio"
            className="block"
          >
            Your bio
          </label>
          <div className="mt-1">
            <textarea
              rows={5}
              id="bio"
              name="bio"
              autoComplete="bio"
              className="w-full rounded border px-2 py-1 dark:border-gray-200 bg-white text-slate-600 dark:text-white dark:bg-slate-800 "
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="twitter"
            className="block"
          >
            Your Twitter user name
          </label>
          <div className="mt-1">
            <input
              id="twitter"
              name="twitter"
              autoComplete="twitter"
              className="w-full rounded border px-2 py-1 dark:border-gray-200 bg-white text-slate-600 dark:text-white dark:bg-slate-800 "
            />
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          disabled={isFormSubmission}
          aria-disabled={isFormSubmission}
          className="w-full rounded bg-sky-700 py-2 px-4 font-bold text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          {isFormSubmission ? "Creating..." : "Create Account"}
        </button>
        <div className="flex items-center justify-center">
          <div className="text-center">
            Already have an account?{" "}
            <Link
              title="login"
              className="dark:text-sky-500 text-sky-800 hover:underline font-bold "
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </Form>
    </AuthFormLayout>
  );
}
