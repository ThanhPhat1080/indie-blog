import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet } from "@remix-run/react";
import ROUTERS from "~/constants/routers";
import { getPublishPosts } from "~/models/note.server";
import type { LinksFunction } from "@remix-run/server-runtime";

import lineWavy from "~/styles/line-wavy.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: lineWavy }];
};

export async function loader() {
  const postArticles = await getPublishPosts();

  return json({ postArticles });
}

export const meta: MetaFunction = () => {
  const description = `Robot personal blog`;
  return {
    charset: "utf-8",
    description,
    keywords: "Remix,Robot,blog",
    "twitter:image":
      "https://res.cloudinary.com/diveoh2pp/image/upload/v1670398746/Screenshot_120722_023903_PM_j2w20w.jpg",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@phat_truong",
    "twitter:site": "@phat_truong",
    "twitter:title": "Remix Blog",
    "twitter:description": description,
  };
};

export default function BlogIndex() {
  return (
    <div className="bg-white dark:bg-slate-800 relative">
      <header className="relative z-10 px-4 py-4 text-lg sm:px-3 md:px-0">
        <div className="mx-auto flex items-center justify-between md:max-w-3xl lg:max-w-5xl 2xl:max-w-7xl">
          <Link to={ROUTERS.ROOT} title="Home">
            <img
              alt="Blog Logo"
              src="/assets/images/logo.webp"
              width="75"
              height="50"
            />
          </Link>
          <nav className="flex items-center gap-8 font-bold dark:text-gray-400">
            <NavLink
              className={({ isActive }) =>
                `pb-2 decoration-wavy hover:underline ${
                  isActive ? "text-sky-500 underline" : ""
                }`
              }
              to={ROUTERS.ROOT}
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `pb-2 decoration-wavy hover:underline ${
                  isActive ? "text-sky-500 underline" : ""
                }`
              }
              to={ROUTERS.ABOUT_ME}
              prefetch="intent"
            >
              About me
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bottom-0 mt-[300px] text-center text-lg dark:text-gray-300 relative">
        <div className="absolute bottom-0 left-0 w-full items-end justify-center">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="h-[100px] w-full rotate-180"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-sky-200 dark:fill-slate-900"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-sky-200 dark:fill-slate-900"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-sky-200 dark:fill-slate-900"
            ></path>
          </svg>
          <span className="top-[calc(_50%_+_20px_)] left-1/2 -translate-x-1/2 -translate-y-1/2 transform absolute w-full md:w-1/2">
            Made with <span className="text-red">&#10084;</span> by Phat Truong
          </span>
        </div>
      </footer>
    </div>
  );
}
