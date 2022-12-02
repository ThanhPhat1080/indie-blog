import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import marked from "marked";
import sanitizeHtml from "sanitize-html";

import type { Post } from "~/models/note.server";
import { deletePostBySlug, getPostBySlug } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { CloudinaryImageLoader, TextWithMarkdown } from "~/components";
import { isEmptyOrNotExist } from "~/utils";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import ROUTERS from "~/constants/routers";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-dark.min.css",
    },
  ];
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
      <div className="w-100 text-md sticky top-0 z-20 flex h-10 items-center justify-end gap-4 bg-slate-600 p-2 py-1 text-white">
        <div className="flex items-center gap-4">
          <Link to={`${ROUTERS.DASHBOARD}/formEditor-test?id=${post.id}`}>
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
      <div className="mx-auto my-12 flex min-h-screen max-w-3xl flex-col px-3 lg:px-0">
        <article>
          <section className="border-b pb-8">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <div className="my-8" />
            <span className="flex items-center gap-x-4 font-semibold">
              <span className="flex flex-col">
                <span>{author.name}</span>
                <span>
                  {new Date(post.updatedAt)
                    .toJSON()
                    .slice(0, 10)
                    .replace(/-/g, "/")}
                </span>
              </span>
            </span>
            <div className="my-4 border-l pl-2">
              <p className="px-3 text-lg italic text-gray-400">
                {post.preface}
              </p>
            </div>
          </section>

          <CloudinaryImageLoader
            alt={post.title}
            src={post?.coverImage ?? ""}
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
            <TextWithMarkdown text={sanitizeHtml(marked(post.body))} style={{background: 'rgb(30 41 59)'}} />
          </section>
          <hr className="my-4" />
        </article>
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
