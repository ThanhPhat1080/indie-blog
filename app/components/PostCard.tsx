import * as React from "react";
import type { Post } from "@prisma/client";
import { Link } from "@remix-run/react";

import CloudinaryImageLoader from "./CloudinaryImageLoader";

export const PostCard = (props: Partial<Post>) => {
  const { title, preface, isPublish, slug = "", coverImage, updatedAt } = props;
  return (
    <div className="relative rounded-xl border border-gray-200 shadow-md dark:border-gray-700 dark:bg-slate-800">
      <Link to={slug} title={slug} prefetch="intent">
        <div className="h-48 overflow-hidden rounded-lg">
          <CloudinaryImageLoader
            alt={"Post cover image:" + title}
            src={coverImage || ""}
            options={{ fit: "fill" }}
            responsive={[
              {
                size: {
                  width: 200,
                },
                maxWidth: 800,
              },
            ]}
            className="w-full h-full rounded-lg"
          />
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center justify-between py-2">
          <em className="text-xs dark:text-gray-400">{`Last updated: ${updatedAt
            ?.toJSON()
            .slice(0, 10)
            .replace(/-/g, "/")}`}</em>
          {isPublish ? (
            <div className=" rounded-xl border-2 border-green-500 px-3 text-green-500">
              Published
            </div>
          ) : (
            <div className=" rounded-xl border-2 border-gray-500 px-3 dark:text-gray-500">
              Draft
            </div>
          )}
        </div>
        <Link to={slug} title={slug} prefetch="intent">
          <h5 className="mb-2 max-h-20 overflow-hidden text-lg font-bold tracking-tight line-clamp-3 dark:text-slate-200 hover:underline">
            {title}
          </h5>
        </Link>
        <p className="mb-1 h-10 max-h-10 overflow-hidden text-sm font-normal dark:text-slate-400 line-clamp-2">
          {preface}
        </p>
        <Link
          to={slug}
          title={slug}
          prefetch="intent"
          className="items-center inline-flex justify-center rounded bg-sky-700 py-2 px-4 font-bold text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          Preview
          <svg
            aria-hidden="true"
            className="ml-2 -mr-1 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(PostCard);
