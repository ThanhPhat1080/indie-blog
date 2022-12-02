import { memo } from "react";
import type { Post } from "@prisma/client";
import { Link } from "@remix-run/react";
import CloudinaryImageLoader from "./CloudinaryImageLoader";

export const PostArticle = (props: Partial<Post>) => {
  const { title, preface, slug = "", coverImage, updatedAt } = props;

  const updateAtString = updatedAt?.toJSON().slice(0, 10).replace(/-/g, "/");
  const linkToPostContent = ""
  return (
    <article className="flex flex-col gap-3">
      <div className="h-96 overflow-hidden rounded-lg shadow-lg">
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
          className="w-full"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between py-2">
          <em className="dark:text-gray-400">{`Last updated: ${updateAtString}`}</em>
        </div>
        <Link to={slug}>
          <h3 className="mb-4 max-h-20 overflow-hidden text-2xl font-bold tracking-tight line-clamp-3 dark:text-gray-300 pb-2 hover:underline decoration-wavy">
            {title}
          </h3>
        </Link>
        <em className="mb-3 h-10 max-h-10 overflow-hidden text-lg font-normal line-clamp-3 dark:text-gray-400">
          {preface}
        </em>
      </div>
    </article>
  );
};

export default memo(PostArticle);
