import type { Post } from "@prisma/client";
import * as React from "react";
import { Link } from "react-router-dom";
import CloudinaryImageLoader from "./CloudinaryImageLoader";

export const PostCard = (props: Partial<Post>) => {
  const { title, preface, isPublish, slug = "", coverImage, updatedAt } = props;
  return (
    <div className="relative rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
      <Link to={slug}>
        <div className="h-40 overflow-hidden rounded-t-lg shadow-lg">
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
            className="w-full"
          />
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center justify-between py-2">
          <em className="text-xs text-gray-400">{`Last updated: ${updatedAt
            ?.toJSON()
            .slice(0, 10)
            .replace(/-/g, "/")}`}</em>
          {isPublish ? (
            <div className=" rounded-xl border-2 border-green-500 px-3 text-green-500">
              Published
            </div>
          ) : (
            <div className=" rounded-xl border-2 border-gray-500 px-3 text-gray-500">
              Draft
            </div>
          )}
        </div>
        <Link to={slug}>
          <h5 className="mb-4 max-h-20 overflow-hidden text-lg font-bold tracking-tight text-gray-900 line-clamp-3 dark:text-white">
            {title}
          </h5>
        </Link>
        <p className="mb-3 h-10 max-h-10 overflow-hidden text-sm font-normal text-gray-700 line-clamp-2 dark:text-gray-400">
          {preface}
        </p>
        <Link
          to={slug}
          className="inline-flex items-center rounded-lg bg-sky-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-300 active:scale-95 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
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
            ></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(PostCard);
