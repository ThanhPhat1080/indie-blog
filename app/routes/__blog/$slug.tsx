import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPost, getPostBySlug, getPublishPosts } from "~/models/note.server";
import { isEmptyOrNotExist } from "~/utils";
import type { Post } from "~/models/note.server";
import { PostArticleContent } from "~/components/PostArticleContent";

import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { PostArticle } from "~/components";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-dark.min.css",
    },
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, "Post not found");

  const post = (await getPostBySlug(params.slug)) as Post;
  const listPostsRelative = await getPublishPosts({
    NOT: { slug: params.slug },
  });

  if (!post) {
    return json({
      error: "Post not found",
      status: 404,
      post: null,
      listPostsRelative,
    });
  }

  return json({
    error: "",
    status: 200,
    post: post as Post,
    listPostsRelative,
  });
};

export default function PostArticleContentDetail() {
  const data = useLoaderData<typeof loader>();

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
          <p className="text-gray-400">{data.error}</p>
        )}

        <h2 className="my-8 text-4xl font-semibold uppercase text-gray-200">
          Relative posts
        </h2>
      <section className="mx-auto mb-5 flex flex-col w-full px-5 md:px-0 md:w-4/5 lg:max-w-2xl 2xl:max-w-3xl">
        {data.listPostsRelative.map((post, index) => (
          <div className="my-5" key={post.id}>
            <PostArticle
              {...post}
              createdAt={new Date(post.createdAt)}
              updatedAt={new Date(post.updatedAt)}
            />
            {index < data.listPostsRelative.length - 1 && (
              <hr className="line-wavy" />
            )}
          </div>
        ))}
      </section>
      </div>
    </>
  );
}
