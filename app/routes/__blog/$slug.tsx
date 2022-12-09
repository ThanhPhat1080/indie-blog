import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPostBySlug, getPublishPosts } from "~/models/note.server";
import type { Post } from "~/models/note.server";
import {
  PostArticleContent,
  links as PostArticleContentLinks,
} from "~/components/PostArticleContent";
import { PostArticle } from "~/components";

import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [...PostArticleContentLinks()];
};

type LoaderData = { post: Post };

export const meta: MetaFunction = ({ data, location }: { data: LoaderData, location: any }) => {
  if (!data) {
    return {
      title: "No blog",
      description: "No blog found",
    };
  }
  
  const title = data.post?.title || "Blog";
  const description = data.post?.preface || "";
  
  return {
    title: title || "Blog",
    description: description || title || "",
    "twitter:title": title,
    "twitter:description": description,
    "og:url": location,
    "og:title": title,
    "og:description": description,
  };
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
          <p className="dark:text-gray-400">{data.error}</p>
        )}

        <h4 className="my-8 text-4xl font-semibold uppercase dark:text-gray-200">
          Relative posts
        </h4>
        <section className="mx-auto mb-5 flex w-full flex-col px-5 md:w-4/5 md:px-0 lg:max-w-2xl 2xl:max-w-3xl">
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
