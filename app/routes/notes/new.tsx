import * as React from "react";

import type { ActionArgs, LinksFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { TextWithMarkdown } from "~/components";

import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

import stylesMarkdowPreview from "~/styles/markdown-preview.css";

import { isEmptyOrNotExist } from "~/utils";

import ROUTERS from "~/constants/routers";

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
  const prefaceRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  const isTitleError = !isEmptyOrNotExist(actionData?.errors?.title);
  const isPrefaceError = !isEmptyOrNotExist(actionData?.errors?.preface);
  const isBodyError = !isEmptyOrNotExist(actionData?.errors?.body);

  React.useEffect(() => {
    if (isTitleError) {
      titleRef.current?.focus();
    }
    if (isPrefaceError) {
      prefaceRef.current?.focus();
    }
    if (isBodyError) {
      bodyRef.current?.focus();
    }
  });

  return (
    <div className="flex h-full">
      <div className="h-full flex-1 border-r-2 border-gray-400">
        <Form
          method="post"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
            flex: 1,
            height: "100%",
            padding: "0",
          }}
        >
          <div className="w-100 flex h-5 items-center justify-between bg-slate-600 p-2 text-xs text-white">
            <Link to={ROUTERS.DASHBOARD}>Return</Link>
            <div>
              <label className="mx-2 px-2">
                <input type="checkbox" className="mx-2" />
                Publish
              </label>
              <button
                type="submit"
                className="text-xs text-white hover:text-blue-600 focus:text-blue-400"
              >
                Save
              </button>
            </div>
          </div>
          <div className="d-flex h-full flex-1 px-1">
            <label className="text-stale flex w-full flex-col gap-1 text-sm">
              Title
              <input
                ref={titleRef}
                name="title"
                autoFocus
                className="w-full rounded-md border-2 border-gray-100 px-3 text-lg leading-loose text-black"
                aria-invalid={isTitleError ? true : undefined}
                aria-errormessage={isTitleError ? "title-error" : undefined}
                onChange={(e) =>
                  setNotePreview((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
              {isTitleError && (
                <div className="pt-1 text-red-700" id="title-error">
                  {actionData!.errors.title}
                </div>
              )}
            </label>
            <label className="text-stale flex w-full flex-col gap-1 text-sm">
              Preface
              <input
                name="preface"
                className="w-full rounded-md border-2 border-gray-100 px-3 text-lg leading-loose  text-black"
                aria-invalid={isPrefaceError ? true : undefined}
                aria-errormessage={isPrefaceError ? "preface-error" : undefined}
                onChange={(e) =>
                  setNotePreview((prev) => ({
                    ...prev,
                    preface: e.target.value,
                  }))
                }
              />
              {isPrefaceError && (
                <div className="pt-1 text-red-700" id="title-error">
                  {actionData!.errors.preface}
                </div>
              )}
            </label>
            <label className="text-stale flex w-full flex-1 flex-col gap-1 text-sm">
              Body
              <textarea
                ref={bodyRef}
                name="body"
                rows={15}
                className="w-full flex-1 rounded-md border-2 border-gray-100 py-2 px-3 text-xs leading-6 text-black"
                aria-invalid={isBodyError ? true : undefined}
                aria-errormessage={isBodyError ? "body-error" : undefined}
                onChange={(e) =>
                  setNotePreview((prev) => ({ ...prev, body: e.target.value }))
                }
              />
              {isBodyError && (
                <div className="pt-1 text-red-700" id="body-error">
                  {actionData!.errors.body}
                </div>
              )}
            </label>
          </div>
        </Form>
      </div>
      <div className="h-full flex-1 border-l-2 border-gray-400">
        <div className="w-100 flex h-5 items-center justify-center bg-slate-600 p-2 text-xs text-white">
          <h2 className="">Post preview</h2>
        </div>
        <div className="mt-3 px-1">
          <h2 className="min-h-[3rem] text-center text-3xl font-bold">
            {notePreview.title ? (
              notePreview.title
            ) : (
              <em className="text-slate-400">Your title</em>
            )}
          </h2>
          <h3 className="my-4 border-l-2 border-slate-200 pl-2 text-lg text-slate-500">
            {notePreview.preface ? (
              notePreview.preface
            ) : (
              <em className="text-slate-400">Your preface</em>
            )}
          </h3>
          <div className="d-flex h-full max-h-[calc(100vh_-_10rem)] overflow-scroll rounded border-2 border-gray-100">
            <TextWithMarkdown
              customClasses="flex-1 text-xs"
              text={notePreview.body}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
