import { json } from "@remix-run/node";

import { getPostBySlug } from "~/models/note.server";

export const loader = async ({ params }) => {
  const post = await getPostBySlug(params.postSlug);
  return json({ post });
};
export const PostArticleContent = (props) => {
  const { post } = props;

  return <PostArticleContent {...post} />;
};

export default PostArticleContent;
