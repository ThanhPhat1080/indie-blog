import { memo } from "react";
import type { Post, User } from "@prisma/client";
import { Link } from "@remix-run/react";
import CloudinaryImageLoader from "./CloudinaryImageLoader";

export const PostArticle = (
  props: Partial<Post> & {
    linkToPrefix?: string;
    author: Pick<User, "name" | "avatar">;
  }
) => {
  const {
    title,
    preface,
    slug = "",
    coverImage,
    updatedAt = "",
    linkToPrefix,
    author,
  } = props;

  const updateAtString = new Date(updatedAt)
    .toJSON()
    .slice(0, 10)
    .replace(/-/g, "/");

  const linkToPostContent = `${linkToPrefix || ""}/${slug}`;
  return (
    <article className="flex flex-col gap-3 hover:-translate-y-5 transition duration-700 ease-in-out">
      <Link to={linkToPostContent} prefetch="intent">
        <div className="h-56 md:h-72 lg:h-96 overflow-hidden rounded-lg shadow-md">
          <CloudinaryImageLoader
            alt={"Post cover image:" + title}
            src={coverImage || ""}
            options={{ fit: "cover" }}
            responsive={[
              {
                size: {
                  width: 800,
                },
                maxWidth: 1024,
              },
              {
                size: {
                  width: 400,
                },
                maxWidth: 768,
              },
            ]}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="pb-4">
        <Link to={linkToPostContent} prefetch="intent" className="inline-block">
          <h2 className="pb-2 max-h-fit overflow-hidden text-2xl font-bold tracking-tight decoration-wavy line-clamp-3 hover:underline dark:text-sky-400 text-sky-700 w-fit">
            {title}
          </h2>
        </Link>
        <em className="border-l-4 border-slate-500 pl-4 max-h-fit overflow-hidden text-xl font-normal text-slate-400 line-clamp-3 dark:text-gray-400">
          {preface}
        </em>
      </div>
      <div className="flex gap-3">
        <div className="relative h-12 w-12 border-spacing-3 overflow-hidden rounded-full border-2 border-sky-500 bg-white">
          <CloudinaryImageLoader
            className="absolute-center"
            src={author.avatar || ""}
            height="50"
            width="50"
            alt={author.name + "-avatar"}
            responsive={[
              {
                size: {
                  width: 50,
                },
                maxWidth: 800,
              },
            ]}
          />
        </div>
        <div className="text-sm dark:text-slate-300">
          <p className="font-semibold">{author.name}</p>
          <em className="font-thin dark:text-gray-400">{updateAtString}</em>
        </div>
      </div>
    </article>
  );
};

export default memo(PostArticle);
