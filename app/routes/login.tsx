import * as React from "react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { isEmptyOrNotExist, safeRedirect, validateEmail } from "~/utils";

import ROUTERS from "~/constants/routers";
import { AuthFormLayout } from "~/components";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect(ROUTERS.ROOT);
  }

  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  const redirectTo = safeRedirect(
    formData.get("redirectTo"),
    `${ROUTERS.DASHBOARD}/profile`
  );

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const transition = useTransition();

  const redirectTo =
    searchParams.get("redirectTo") || `${ROUTERS.DASHBOARD}/profile`;
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const isEmailError = !isEmptyOrNotExist(actionData?.errors.email);
  const isPasswordError = !isEmptyOrNotExist(actionData?.errors.password);
  const isFormSubmission = !isEmptyOrNotExist(transition.submission);

  React.useEffect(() => {
    if (isEmailError) {
      emailRef.current?.focus();
    }
    if (isPasswordError) {
      passwordRef.current?.focus();
    }
  });

  return (
    <AuthFormLayout formName="login">
      <Form
        method="post"
        className="space-y-6 text-white"
        aria-describedby="Login form"
        aria-details="Login form"
      >
        <div>
          <label htmlFor="email" className="block">
            Email address
          </label>
          <div className="mt-1">
            <input
              ref={emailRef}
              id="email"
              required
              autoFocus={true}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={isEmailError ? true : undefined}
              aria-describedby="email-error"
              className="w-full rounded border px-2 py-1 dark:border-gray-200 bg-white text-slate-600 dark:text-white dark:bg-slate-800"
              defaultValue="admin@admin.com"
            />
            {isEmailError && (
              <div className="pt-1 text-red-400" id="email-error">
                {actionData!.errors.email}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={isPasswordError ? true : undefined}
              aria-describedby="password-error"
              className="w-full rounded border px-2 py-1 dark:border-gray-200 bg-white text-slate-600 dark:text-white dark:bg-slate-800"
              defaultValue="adminadmin"
            />
            {isPasswordError && (
              <div className="pt-1 text-red-400" id="password-error">
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
          className="w-full rounded bg-sky-700 py-2 px-4 font-bold text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          {isFormSubmission ? "Logging in" : "Log in"}
        </button>
        <div className="flex items-center justify-between">
          <label htmlFor="remember" className="flex items-center cursor-pointer">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              disabled={isFormSubmission}
              className=" mr-2 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            {"  "}
            Remember me
          </label>
          <div className="text-center">
            Don't have an account?{" "}
            <Link
              title="Register"
              className="dark:text-sky-500 font-bold text-sky-800 hover:underline"
              to={{
                pathname: ROUTERS.REGISTER,
                search: searchParams.toString(),
              }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </Form>
    </AuthFormLayout>
  );
}
