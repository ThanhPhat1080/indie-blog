import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPostBySlug, getPublishPosts } from "~/models/note.server";
import type { Post } from "prisma/prisma-client";
import {
  PostArticleContent,
  links as PostArticleContentLinks,
} from "~/components/PostArticleContent";
import { PostArticle } from "~/components";

import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { capitalizeFirstLetter, convertUrlSlug } from "~/utils";

export const links: LinksFunction = () => {
  return [...PostArticleContentLinks()];
};

export const meta: MetaFunction = ({ data, location, parentsData }) => {
  if (!data) {
    return {
      title: "Personal technical blog - Not found",
      description: "Personal technical blog - Not found",
    };
  }

  const title = data.post?.title || "Personal technical blog";
  const description = data.post?.preface || "";
  const author = data.post?.user?.name || "";
  const avatar = data.post?.user?.avatar || "";
  const titleInOG = convertUrlSlug(title, "+");
  const authorInOG = convertUrlSlug(
    author.split(" ").map(capitalizeFirstLetter).join(" "),
    "+"
  );
  const avatarInOG = `https://res.cloudinary.com/diveoh2pp/b_rgb:00000000,c_fill,w_50,g_center,q_80,f_auto/${avatar}`;
  const OGImage = `https://vercel-og-nextjs-indol-iota.vercel.app/api/param?title=${titleInOG}&author=${authorInOG}&avatar=${avatarInOG}`;

  return {
    title,
    description: description || title || "",
    keywords: "technical blog,Remix indie," + title,

    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": OGImage,

    "og:url": location,
    "og:title": title,
    "og:description": description,
    "og:image": OGImage,
    "og:image:url": OGImage,
    "og:image:type": "png/jpg/jpeg",
    "og:image:alt": title,
    "og:image:width": "1200",
    "og:image:height": "630",
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
    <div className="relative">
      <div className="absolute top-[-110px] left-0 h-full w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[500px] w-[calc(_200%_+_2px_)] rotate-180"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-sky-300 dark:fill-slate-700"
          ></path>
        </svg>
      </div>

      <div className="relative pt-40">
        <div className="2xlg:max-w-7xl mx-auto mb-5 flex w-full flex-col px-5 md:max-w-3xl lg:max-w-5xl lg:px-0">
          {data.post ? (
            <section className="pb-8">
              <PostArticleContent
                {...data.post}
                author={data.post.user}
                createdAt={new Date(data.post.createdAt)}
                updatedAt={new Date(data.post.updatedAt)}
              />
            </section>
          ) : (
            <p className="dark:text-gray-400">{data.error}</p>
          )}
        </div>
        <section className="relative bg-sky-200 pt-20 dark:bg-slate-900">
          <div className="absolute -top-1 left-0 w-full rotate-180 overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                className="fill-white dark:fill-slate-800"
              ></path>
            </svg>
          </div>

          <div className="xlg:w-1/2 mx-auto mb-40 flex w-full flex-col px-5 lg:w-3/4 lg:px-0">
            <h4 className="relative z-10 my-16 pt-20 text-center text-4xl font-semibold uppercase dark:text-gray-200 ">
              Relative posts
            </h4>
            <section className="relative mx-auto flex w-full flex-col px-5 pb-5 md:w-4/5 md:px-0 lg:max-w-2xl 2xl:max-w-3xl">
              {data.listPostsRelative.map((post, index) => (
                <div className="my-5" key={post.id}>
                  <PostArticle
                    {...post}
                    author={post.user}
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
        </section>
        <div className="absolute bottom-[-100px] left-0 w-full items-end justify-center">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="h-[100px] w-full"
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
        </div>
      </div>
    </div>
  );
}
