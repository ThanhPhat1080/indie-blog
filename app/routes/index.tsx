import { Link, useLoaderData } from "@remix-run/react";
import ROUTERS from "~/constants/routers";
import { getPublishPosts } from "~/models/note.server";
import { json } from "@remix-run/node";

import type { LinksFunction } from "@remix-run/server-runtime";
import { PostArticle } from "~/components";

import lineWave from "~/styles/line-wave.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: lineWave }];
};

export async function loader() {
  const postArticles = await getPublishPosts();

  return json({ postArticles });
}

export default function Index() {
  const { postArticles } = useLoaderData<typeof loader>();

  return (
    <main className="bg-slate-800">
      <header className="flex mx-auto py-4 justify-between items-center md:max-w-3xl lg:max-w-5xl 2xl:max-w-7xl">
        <img
          alt="Blog Logo"
          src="/assets/images/logo.webp"
          width="75"
          height="50"
        />
        <nav className="flex gap-8 font-bold dark:text-gray-400 items-center">
          <Link
            className="pb-2 hover:underline decoration-wavy"
            to={ROUTERS.ROOT}
          >
            Home
          </Link>
          <Link
            className="pb-2 hover:underline decoration-wavy"
            to={ROUTERS.ABOUT_ME}
          >
            About me
          </Link>
        </nav>
      </header>
      <div className="md:max-w-3xl lg:max-w-5xl 2xl:max-w-7xl mx-auto">
        <section className="h-screen items-center flex gap-8 dark:text-gray-300">
          <div className="flex-1">
            <h1 className="text-7xl my-5 font-semibold">
              Welcome to the my blog.
            </h1>
            <em className="text-3xl font-semibold">
              Let share and learn together.
            </em>
          </div>
          <div>
            <img
              src="assets/images/robot-cute.png"
              alt="robot-cute-Ouch"
              width={256}
              height={311}
              loading="lazy"
              className="flex-1"
            />
          </div>
        </section>
        <section className="flex flex-col mb-5 md:max-w-3xl lg:max-w-2xl 2xl:max-w-3xl mx-auto">
          {postArticles.map((post) => (
            <div className="my-5" key={post.id}>
              <PostArticle
                {...post}
                createdAt={new Date(post.createdAt)}
                updatedAt={new Date(post.updatedAt)}
              />
              <hr className="line-wave" />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
