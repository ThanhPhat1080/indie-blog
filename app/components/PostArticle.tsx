import { memo } from "react";
import type { Post } from "@prisma/client";
import { Link } from "@remix-run/react";
import CloudinaryImageLoader from "./CloudinaryImageLoader";

export const PostArticle = (
  props: Partial<Post> & { linkToPrefix?: string }
) => {
  const {
    title,
    preface,
    slug = "",
    coverImage,
    updatedAt = "",
    linkToPrefix,
  } = props;

  const updateAtString = new Date(updatedAt)
    .toJSON()
    .slice(0, 10)
    .replace(/-/g, "/");

  const linkToPostContent = `${linkToPrefix || ""}/${slug}`;
  return (
    <article className="flex flex-col gap-3">
      <Link to={linkToPostContent} prefetch="intent">
        <div className="h-96 overflow-hidden rounded-lg shadow-md transition duration-700 ease-in-out hover:scale-105">
          <CloudinaryImageLoader
            alt={"Post cover image:" + title}
            src={coverImage || ""}
            options={{ fit: "fill" }}
            responsive={[
              {
                size: {
                  width: 600,
                  height: 400,
                },
                maxWidth: 1024,
              },
            ]}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="pb-5">
        <div className="flex items-center justify-between py-2">
          <em className="dark:text-gray-400">{`Last updated: ${updateAtString}`}</em>
        </div>
        <Link to={linkToPostContent} prefetch="intent">
          <h3 className="mb-4 max-h-20 overflow-hidden pb-2 text-3xl font-bold tracking-tight decoration-wavy line-clamp-3 hover:underline dark:text-gray-300">
            {title}
          </h3>
        </Link>
        <em className="mb-3 h-10 max-h-10 overflow-hidden text-2xl font-normal line-clamp-3 dark:text-gray-400">
          {preface}
        </em>
      </div>
    </article>
  );
};

export default memo(PostArticle);
