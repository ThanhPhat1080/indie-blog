import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Post } from "~/models/note.server";
import { deletePostBySlug, getPostBySlug } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { isEmptyOrNotExist } from "~/utils";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import ROUTERS from "~/constants/routers";
import {
  PostArticleContent,
  links as PostArticleContentLinks,
} from "~/components/PostArticleContent";

export const links: LinksFunction = () => {
  return [...PostArticleContentLinks()];
};

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.slug, "noteId not found");

  const author = await getUserById(userId);
  const post = await getPostBySlug(params.slug, userId);

  if (isEmptyOrNotExist(post)) {
    throw new Response("Not Found", { status: 404 });
  }

  if (isEmptyOrNotExist(author)) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ post, author });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.slug, `Not found this post with slug: ${params.slug}`);

  await deletePostBySlug({ userId, slug: params.slug });

  return redirect(`${ROUTERS.DASHBOARD}/posts`);
}

export default function NoteDetailsPage() {
  const { post, author } = useLoaderData<typeof loader>() as {
    post: Post;
    author: User;
  };

  return (
    <div className="relative">
      <div className="w-100 text-md sticky top-0 z-20 flex h-10 items-center justify-end gap-4 p-2 py-1 text-slate-200 bg-slate-600">
        <div className="flex items-center gap-4">
          <Link
            prefetch="intent"
            title="Edit"
            to={`${ROUTERS.DASHBOARD}/formEditor-test?id=${post.id}`}
          >
            Edit
          </Link>
          <Form method="delete">
            <button
              type="submit"
              className="text-md rounded-lg bg-red-500 px-2 py-1 text-white"
            >
              <strong>Delete</strong>
            </button>
          </Form>
        </div>
      </div>
      <div className="mx-auto my-12 flex min-h-screen max-w-3xl flex-col px-3">
        <PostArticleContent
          {...post}
          createdAt={new Date(post.createdAt)}
          updatedAt={new Date(post.updatedAt)}
        />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
