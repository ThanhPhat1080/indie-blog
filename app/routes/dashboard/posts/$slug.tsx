import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import marked from "marked";
import sanitizeHtml from "sanitize-html";

import { deleteNote, getPostBySlug } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { TextWithMarkdown } from "~/components";
import { isEmptyOrNotExist } from "~/utils";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.slug, "noteId not found");

  const post = await getPostBySlug(params.slug, userId);
  if (!post || isEmptyOrNotExist(post)) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ post });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.post.title}</h3>
      <div className="py-6">
      {/* @ts-ignore */}
      <TextWithMarkdown text={sanitizeHtml(marked(data.post.body))}/>
      </div>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
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
