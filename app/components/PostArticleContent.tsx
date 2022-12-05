import type { Post } from "@prisma/client";
import CloudinaryImageLoader from "./CloudinaryImageLoader";
import TextWithMarkdown from "./TextWithMarkdown";

import marked from "marked";
import sanitizeHtml from "sanitize-html";

export const PostArticleContent = (
  props: Partial<Post> & { author?: string }
) => {
  const {
    title,
    preface,
    coverImage,
    body,
    updatedAt = "",
    author = "",
  } = props;
  return (
    <article aria-details={title} aria-label={title} className="w-full">
      <div className="mb-8">
        <h1 className="text-8xl font-bold dark:text-gray-200">{title}</h1>
        <div className="my-8" />
        <span className="flex items-center gap-x-4 font-semibold">
          <span className="flex flex-col dark:text-gray-200">
            {author && <span>{author}</span>}
            <em>
              {new Date(updatedAt).toJSON().slice(0, 10).replace(/-/g, "/")}
            </em>
          </span>
        </span>
        <div className="my-4 border-l pl-2">
          <p
            aria-details={preface}
            className="px-3 text-xl italic dark:text-gray-300"
          >
            {preface}
          </p>
        </div>
      </div>

      <div className="mt-4 h-[600px] overflow-hidden rounded-xl shadow-lg">
        <CloudinaryImageLoader
          alt={title || ""}
          src={coverImage || ""}
          options={{ fit: "fill" }}
          responsive={[
            {
              size: {
                width: 500,
              },
              maxWidth: 1000,
            },
          ]}
          width="675"
          height="675"
          className="w-full object-cover"
        />
      </div>

      <hr className="line-wavy" />

      <div className="py-6">
        <TextWithMarkdown
          //@ts-ignore
          text={sanitizeHtml(marked(body))}
          style={{ background: "rgb(30 41 59)", fontSize: "1.8em" }}
        />
      </div>
    </article>
  );
};
