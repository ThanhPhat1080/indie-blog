import { Suspense, use } from "react";
import { defer } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPostBySlug, getPublishPosts } from "~/models/note.server";
import type { Post } from "~/models/note.server";
import {
  PostArticleContent,
  links as PostArticleContentLinks,
} from "~/components/PostArticleContent";
import { CardSkeleton,  } from "~/components";

import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import ListPostArticles from "~/components/ListPostArticle";

export const links: LinksFunction = () => {
  return [...PostArticleContentLinks()];
};

type LoaderData = { post: Post };

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  if (!data) {
    return {
      title: "No blog",
      description: "No blog found",
    };
  }
  return {
    title: data.post?.title || "Blog",
    description: data.post?.preface || "",
  };
};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, "Post not found");

  const post = (await getPostBySlug(params.slug)) as Post;
  const listPostsRelativeAsync = getPublishPosts({
    NOT: { slug: params.slug },
  }) as Promise<Post[]>;

  if (!post) {
    return defer({
      error: "Post not found",
      status: 404,
      post: null,
      listPostsRelativeAsync,
    });
  }

  return defer({
    error: "",
    status: 200,
    post: post as Post,
    listPostsRelativeAsync: listPostsRelativeAsync as Promise<Post[]>,
  });
};

export default function PostArticleContentDetail() {
  const data = useLoaderData();
console.log('data.postArticlesAsync', data.postArticlesAsync);

  return (
    <>
      <div className="xlg:w-1/2 mx-auto mb-5 flex w-full flex-col px-5 lg:w-3/4 lg:px-0">
        {data.post ? (
          <section className="border-b-2 border-gray-400 pb-8">
            <PostArticleContent
              {...data.post}
              createdAt={new Date(data.post.createdAt)}
              updatedAt={new Date(data.post.updatedAt)}
            />
          </section>
        ) : (
          <p className="dark:text-gray-400">{data.error}</p>
        )}

        <h4 className="my-8 text-4xl font-semibold uppercase dark:text-gray-200">
          Relative posts
        </h4>
        <section className="mx-auto mb-5 flex min-h-[calc(_100vh_*_0.5)] w-full flex-col px-5 md:w-4/5 md:px-0 lg:max-w-2xl 2xl:max-w-3xl">
          <Suspense fallback={<CardSkeleton />}>
            <ListPostArticles postArticles={use(data.listPostsRelativeAsync)} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
