import marked from "marked";

import markDownBody from "../styles/mark-down-body.css";
import lineWavy from "../styles/line-wavy.css";
import atomOneDark from '../styles/atom-one-dark.min.css';

import type { LinksFunction } from "@remix-run/node";

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
    {
      rel: "stylesheet",
      href: atomOneDark
    }
  ];
};

// @ts-ignore
marked.setOptions({
  highlight: function (code: any, lang: any) {
    const hljs = require("highlight.js/lib/common");
    const language = hljs.getLanguage(lang) ? lang : "plaintext";

    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-",
});

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
        // @ts-ignore
        __html: marked.parse(text),
      }}
    />
  );
}
