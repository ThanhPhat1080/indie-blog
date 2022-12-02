import type { Post } from "@prisma/client";
import CloudinaryImageLoader from "./CloudinaryImageLoader";
import TextWithMarkdown from "./TextWithMarkdown";

import marked from "marked";
import sanitizeHtml from "sanitize-html";

export const PostArticleContent = (
  props: Partial<Post> & { author: string }
) => {
  const { title, preface, coverImage, body, updatedAt, author } = props;
  return (
    <article>
      <section className="border-b pb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="my-8" />
        <span className="flex items-center gap-x-4 font-semibold">
          <span className="flex flex-col">
            {author && <span>{author}</span>}
            <span>
              {new Date(updatedAt).toJSON().slice(0, 10).replace(/-/g, "/")}
            </span>
          </span>
        </span>
        <div className="my-4 border-l pl-2">
          <p className="px-3 text-lg italic text-gray-400">{preface}</p>
        </div>
      </section>

      <CloudinaryImageLoader
        alt={title || ""}
        src={coverImage || ""}
        options={{ fit: "contain" }}
        responsive={[
          {
            size: {
              width: 500,
            },
            maxWidth: 1000,
          },
        ]}
        width="1200"
        height="675"
        className="my-12 mx-auto rounded-md shadow-lg"
      />
      <hr className="my-4" />

      <section className="py-6">
        {/* @ts-ignore */}
        <TextWithMarkdown
          text={sanitizeHtml(marked(body))}
          style={{ background: "rgb(30 41 59)" }}
        />
      </section>
      <hr className="my-4" />
    </article>
  );
};
