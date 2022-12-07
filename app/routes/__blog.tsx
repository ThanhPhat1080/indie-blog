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
    "twitter:image": "https://res.cloudinary.com/diveoh2pp/image/upload/v1670398746/Screenshot_120722_023903_PM_j2w20w.jpg",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@phat_truong",
    "twitter:site": "@phat_truong",
    "twitter:title": "Remix Blog",
    "twitter:description": description,
  };
};

export default function BlogIndex() {
  return (
    <main className="bg-cyan-100 dark:bg-slate-800">
      <div className="mx-auto md:max-w-3xl lg:max-w-5xl 2xl:max-w-7xl">
        <header className="flex items-center justify-between px-4 py-4 text-lg sm:px-3 md:px-0">
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
                  isActive ? "underline text-sky-500" : ""
                }`
              }
              to={ROUTERS.ROOT}
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `pb-2 decoration-wavy hover:underline ${
                  isActive ? "underline text-sky-500" : ""
                }`
              }
              to={ROUTERS.ABOUT_ME}
              prefetch="intent"
            >
              About me
            </NavLink>
          </nav>
        </header>

        <Outlet />
      </div>
      <hr className="line-wavy" style={{ margin: 0 }} />
      <footer className="p-4 text-center text-lg dark:text-gray-300">
        Made with <span className="text-red">&#10084;</span> by Phat Truong
      </footer>
    </main>
  );
}
