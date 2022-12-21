import type { Post, User } from "@prisma/client";
import CloudinaryImageLoader from "./CloudinaryImageLoader";
import TextWithMarkdown, {
  links as TextWithMarkdownLinks,
} from "./TextWithMarkdown";
import type { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [...TextWithMarkdownLinks()];
};

export const PostArticleContent = (
  props: Partial<Post> & { author: Pick<User, "name" | "avatar"> }
) => {
  const { title, preface, coverImage, body, updatedAt = "", author } = props;

  const updateAtString = new Date(updatedAt)
    .toJSON()
    .slice(0, 10)
    .replace(/-/g, "/");

  return (
    <article aria-details={title} aria-label={title} className="w-full">
      <div className="my-8">
        <h1 className="text-4xl font-bold dark:text-gray-200 lg:text-6xl 2xl:text-8xl">
          {title}
        </h1>
        <div className="my-8" />
        <div className="flex gap-3 text-md">
          <div className="relative h-12 w-12 border-spacing-3 overflow-hidden rounded-full border-2 border-sky-500 dark:border-slate-500">
            <CloudinaryImageLoader
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
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
          <div className="dark:text-slate-300">
            <p className="font-semibold">{author.name}</p>
            <em className="font-thin dark:text-gray-400">{updateAtString}</em>
          </div>
        </div>
        <div className="my-8 border-l-4 border-slate-500 pl-4">
          <blockquote
            aria-details={preface}
            className="px-3 text-xl italic dark:text-gray-300"
          >
            {preface}
          </blockquote>
        </div>
      </div>

      <div className="mt-4 h-[600px] overflow-hidden rounded-xl shadow-lg">
        <CloudinaryImageLoader
          alt={title || ""}
          src={coverImage || ""}
          options={{ fit: "cover" }}
          responsive={[
            {
              size: {
                width: 675,
              },
              maxWidth: 1024,
            },
          ]}
          width="675"
          height="675"
          className="h-full w-full object-cover"
        />
      </div>

      <hr className="line-wavy" />

      <div className="py-6">
        <TextWithMarkdown
          text={body}
          style={{ background: "inherit", fontSize: "1.5em" }}
        />
      </div>
    </article>
  );
};
