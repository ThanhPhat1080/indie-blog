import { Link, Outlet, useLoaderData } from "@remix-run/react";
import ROUTERS from "~/constants/routers";
import { getPublishPosts } from "~/models/note.server";
import { json } from "@remix-run/node";

import { PostArticle } from "~/components";

export async function loader() {
  const postArticles = await getPublishPosts();

  return json({ postArticles });
}

export default function Index() {
  const { postArticles } = useLoaderData<typeof loader>();

  return (
    <>
      <section className="flex h-screen items-center gap-8 dark:text-gray-300">
        <div className="flex-1">
          <h1 className="my-5 text-7xl font-semibold">
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
      <section className="mx-auto mb-5 flex flex-col md:w-4/5 lg:max-w-2xl 2xl:max-w-3xl">
        {postArticles.map((post, index) => (
          <div className="my-5" key={post.id}>
            <PostArticle
              {...post}
              createdAt={new Date(post.createdAt)}
              updatedAt={new Date(post.updatedAt)}
            />
            {index < postArticles.length - 1 && <hr className="line-wavy" />}
          </div>
        ))}
      </section>
    </>
  );
}
