import type { ReactNode } from "react";

const welcomeText = {
  login: "Welcome back!",
  register: "Join us now!",
};

type propsType = {
  children: ReactNode;
  formName: keyof typeof welcomeText;
};

export const AuthFormLayout = ({ children, formName }: propsType) => {
  return (
    <div className="relative flex h-screen text-lg dark:text-gray-300">
      <div className="flex-1 bg-cyan-100 dark:bg-slate-600"></div>
      <div className="flex-1 bg-cyan-300 dark:bg-slate-800"></div>
      <div className="absolute top-1/2 left-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 transform justify-between px-4">
        <div className="rounded-2xl py-20 px-5 bg-cyan-600 bg-opacity-50 dark:bg-slate-900 dark:bg-opacity-75">
          <p className="mx-auto mb-20 text-center text-6xl text-white dark:text-gray-300">
            {welcomeText[formName]}
          </p>
          <div className="flex flex-col-reverse md:flex-row">
            <div className="flex-1 px-5">{children}</div>
            <div className="items-center justify-center">
              <img
                src="/assets/images/robot-cute-wavy.webp"
                width={200}
                height={256}
                alt="robot hey"
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
