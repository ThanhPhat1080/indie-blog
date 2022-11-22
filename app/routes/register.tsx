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
  validateEmail,
  validateUserName,
} from "~/utils";

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

  const user = await createUser(name, email, password);

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
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <h2 className="text-center text-2xl">Create new account!</h2>
        <Form
          method="post"
          className="space-y-6"
          aria-describedby="Create user form"
          aria-details="Create user form"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
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
                className={`w-full rounded border ${
                  isNameError ? "border-red-500" : "border-gray-500"
                } px-2 py-1 text-lg`}
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
              className="block text-sm font-medium text-gray-700"
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
                className={`w-full rounded border ${
                  isEmailError ? "border-red-500" : "border-gray-500"
                } px-2 py-1 text-lg`}
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
              className="block text-sm font-medium text-gray-700"
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
                className={`w-full rounded border ${
                  isPasswordError ? "border-red-500" : "border-gray-500"
                } px-2 py-1 text-lg`}
              />
              {isPasswordError && (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData!.errors.password}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            disabled={isFormSubmission}
            aria-disabled={isFormSubmission}
            className="w-full rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            {isFormSubmission ? "Creating..." : "Create Account"}
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-blue-500 underline"
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
      </div>
    </div>
  );
}
