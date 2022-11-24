import * as React from "react";

import type { ActionArgs, LinksFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { TextWithMarkdown } from "~/components";

import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

import stylesMarkdowPreview from "~/styles/markdown-preview.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesMarkdowPreview }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix-Editor Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const preface = formData.get("preface");
  const body = formData.get("body");

  const defaultErrorObj = { title: null, preface: null, body: null };

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { ...defaultErrorObj, title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof preface !== "string" || preface.length === 0) {
    return json(
      { errors: { ...defaultErrorObj, preface: "Preface is required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { ...defaultErrorObj, body: "Body is required" } },
      { status: 400 }
    );
  }

  const note = await createNote({ title, preface, body, userId });

  return redirect(`/notes/${note.id}`);
}

export default function NewNotePage() {
  const [notePreview, setNotePreview] = React.useState({
    title: "",
    preface: "",
    body: "",
  });

  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="h-full flex-1 border-r-2 border-gray-400 px-4">
        <Form
          method="post"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
            flex: 1,
            padding: "0 1rem",
          }}
        >
          <div>
            <h3 className="text-2xl">Create your new note here</h3>

            <label className="flex w-full flex-col gap-1">
              <label className="flex-1">
                <p>Title</p>
                <input
                  ref={titleRef}
                  name="title"
                  autoFocus
                  className="w-full rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                  aria-invalid={actionData?.errors?.title ? true : undefined}
                  aria-errormessage={
                    actionData?.errors?.title ? "title-error" : undefined
                  }
                  onChange={(e) =>
                    setNotePreview((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex-1">
                <p>Preface</p>
                <input
                  name="preface"
                  className="w-full rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                  aria-invalid={actionData?.errors?.preface ? true : undefined}
                  aria-errormessage={
                    actionData?.errors?.preface ? "preface-error" : undefined
                  }
                  onChange={(e) =>
                    setNotePreview((prev) => ({
                      ...prev,
                      preface: e.target.value,
                    }))
                  }
                />
              </label>
            </label>
            {actionData?.errors?.title && (
              <div className="pt-1 text-red-700" id="title-error">
                {actionData.errors.title}
              </div>
            )}
          </div>

          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Body: </span>
              <textarea
                ref={bodyRef}
                name="body"
                rows={20}
                className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
                aria-invalid={actionData?.errors?.body ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.body ? "body-error" : undefined
                }
                onChange={(e) =>
                  setNotePreview((prev) => ({ ...prev, body: e.target.value }))
                }
              />
            </label>
            {actionData?.errors?.body && (
              <div className="pt-1 text-red-700" id="body-error">
                {actionData.errors.body}
              </div>
            )}
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Save
            </button>
          </div>
        </Form>
      </div>
      <div className="h-full flex-1 border-l-2 border-gray-400 px-4">
        <h3 className="text-2xl">Preview</h3>
        <h2 className="text-2xl">Title: {notePreview.title}</h2>
        <em className="text-xl">Preface: {notePreview.preface}</em>
        <div className="d-flex h-full max-h-[calc(100vh_-_10rem)] overflow-scroll rounded border-2 border-gray-100">
          <TextWithMarkdown customClasses="flex-1" text={notePreview.body} />
        </div>
      </div>
    </div>
  );
}
