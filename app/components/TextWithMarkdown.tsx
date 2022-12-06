import marked from "marked";
import sanitizeHtml from "sanitize-html";

import markDownBody from "../styles/mark-down-body.css";
import lineWavy from "../styles/line-wavy.css";
import type { LinksFunction } from "@remix-run/node";

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  "img",
  "h1",
  "h2",
  "h3",
]);
const allowedAttributes = Object.assign(
  {},
  sanitizeHtml.defaults.allowedAttributes,
  {
    img: ["alt", "src"],
  }
);

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-dark.min.css",
      crossOrigin: "anonymous",
      referrerPolicy: "no-referrer",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-light.min.css",
      crossOrigin: "anonymous",
      referrerPolicy: "no-referrer",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "stylesheet",
      href: markDownBody,
    },
    {
      rel: "stylesheet",
      href: lineWavy,
    },
  ];
};

export default function TextWithMarkdown({
  text = "",
  customClasses = "",
  style = {},
}: {
  text?: String;
  customClasses?: String;
  style?: object;
}) {
  return (
    <div
      className={`markdown-body ${customClasses}`}
      style={style}
      dangerouslySetInnerHTML={{
        //@ts-ignore
        __html: sanitizeHtml(marked(text), {
          allowedTags,
          allowedAttributes,
        }),
      }}
    />
  );
}
