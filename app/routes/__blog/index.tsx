import { useLoaderData,   Meta, } from "@remix-run/react";
import { getPublishPosts } from "~/models/note.server";
import { json, MetaFunction } from "@remix-run/node";

import { PostArticle } from "~/components";

export async function loader() {
  const postArticles = await getPublishPosts();

  return json({ postArticles });
}

export default function Index() {
  const { postArticles } = useLoaderData<typeof loader>();

  return (
    <>
      <section className="flex flex-col sm:flex-row md:h-[calc(_100vh_*_0.6)] items-center gap-8 dark:text-gray-300 w-full lg:w-5/6 mx-auto px-4 lg:px-0">
        <div className="flex-1">
          <h1 className="my-5 text-4xl lg:text-7xl font-semibold">
            Hi, I am
            <span className=" relative mx-5 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-pink-500">
              <em className="relative inline-block font-semibold text-white">
                Robot
              </em>
            </span>
          </h1>
          <h1 className="my-5 text-3xl lg:text-5xl font-semibold">
            Welcome to the my blog.
          </h1>
          <em className="text-3xl lg:text-5xl font-semibold ">
            Let <em className="text-sky-400 underline decoration-wavy">share</em>{" "}
            and <em className="text-sky-400 underline decoration-wavy">learn</em>{" "}
            together.
          </em>
        </div>
        <div>
          <img
            src="assets/images/robot-cute.webp"
            alt="robot-cute-Ouch"
            width={256}
            height={311}
            loading="lazy"
            className="flex-1"
          />
        </div>
      </section>
      <section className="mx-auto mb-5 flex flex-col md:w-4/5 lg:max-w-2xl 2xl:max-w-3xl px-6">
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
