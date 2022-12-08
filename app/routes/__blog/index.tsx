import { Suspense, use } from "react";
import { useLoaderData } from "@remix-run/react";
import type { Post } from "~/models/note.server";
import { getPublishPosts } from "~/models/note.server";
import { defer } from "@remix-run/node";
import { CardSkeleton, PostArticle } from "~/components";
import { isEmptyOrNotExist } from "~/utils";
import ListPostArticles from "~/components/ListPostArticle";

export async function loader() {
  const postArticlesAsync = getPublishPosts() as Promise<Post[]>;

  return defer({ postArticlesAsync });
}

export default function Index() {
  const { postArticlesAsync } = useLoaderData();

  return (
    <>
      <section className="mx-auto flex w-full flex-col items-center gap-8 px-4 dark:text-gray-300 sm:flex-row md:h-[calc(_100vh_*_0.6)] lg:w-5/6 lg:px-0">
        <div className="flex-1">
          <h1 className="my-5 text-4xl font-semibold lg:text-7xl">
            Hi, I am
            <span className=" relative mx-5 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-pink-500">
              <em className="relative inline-block font-semibold text-white">
                Robot
              </em>
            </span>
          </h1>
          <h1 className="my-5 text-3xl font-semibold lg:text-5xl">
            Welcome to the my blog.
          </h1>
          <em className="text-lg font-semibold lg:text-3xl ">
            Let{" "}
            <em className="text-sky-400 underline decoration-wavy">share</em>{" "}
            and{" "}
            <em className="text-sky-400 underline decoration-wavy">learn</em>{" "}
            together.
          </em>
        </div>
        <div>
          <img
            src="assets/images/robot-cute.webp"
            alt="robot-cute-Ouch"
            width={256}
            height={311}
            className="flex-1"
          />
        </div>
      </section>
      <section className="mx-auto mb-5 flex flex-col px-6 md:w-4/5 lg:max-w-2xl 2xl:max-w-3xl min-h-[calc(_100vh_*_0.5)]">
        <Suspense fallback={<CardSkeleton />}>
          <ListPostArticles postArticles={use(postArticlesAsync)} />
        </Suspense>
      </section>
    </>
  );
}

