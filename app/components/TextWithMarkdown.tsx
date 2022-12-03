import marked from "marked";
import sanitizeHtml from "sanitize-html";

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
