import type { LinksFunction } from "@remix-run/node";
import type { ReactNode } from "react";
import waveBackgroundAnimation from "../../styles/wave-background-animation.css";

const welcomeText = {
  login: "Welcome back!",
  register: "Join us now!",
};

type propsType = {
  children: ReactNode;
  formName: keyof typeof welcomeText;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: waveBackgroundAnimation }];
};

export const AuthFormLayout = ({ children, formName }: propsType) => {
  return (
    <div className="wave-background-animation relative flex h-screen text-lg dark:text-gray-300">
      <div className="absolute top-1/2 left-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 transform justify-between px-4">
        <div className="rounded-2xl bg-cyan-600 bg-opacity-50 py-20 px-5 dark:bg-slate-900 dark:bg-opacity-75">
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
