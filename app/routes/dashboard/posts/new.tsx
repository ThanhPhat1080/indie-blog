import * as React from "react";

/// TODO: check slug before upload image

import type {
  UploadHandler,
  ActionArgs,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { createPost, getPostBySlug, cloudinaryUploadImage } from "~/models/note.server";
import { requireUserId } from "~/session.server";

import { SwitchButton, SwitchButtonLink, TextWithMarkdown } from "~/components";

import { 
   convertUrlSlugFormat,
    isEmptyOrNotExist } from "~/utils";

import ROUTERS from "~/constants/routers";

export const links: LinksFunction = () => {
  return [...SwitchButtonLink()];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix-Editor Notes",
  viewport: "width=device-width,initial-scale=1",
});


const uploadImageHandler: (fileInputName: string) => UploadHandler = (fileInputName) => composeUploadHandlers(
  async ({ name, contentType, data, filename }) => {
    if (name !== fileInputName) {
      return undefined;
    }
    const uploadedImage = await cloudinaryUploadImage(data);

    //@ts-ignore
    return uploadedImage.secure_url;
  },

  createMemoryUploadHandler()
);

export async function action({ request }: ActionArgs) {
  let defaultErrorObj = {
    title: null,
    preface: null,
    body: null,
    slug: null,
    coverImage: null,
  };

  const userId = await requireUserId(request);

  // Collect form data
  const formData = await parseMultipartFormData(request, uploadImageHandler("coverImage"));
  const slug = formData.get("slug");
  const title = formData.get("title");
  const preface = formData.get("preface");
  const body = formData.get("body");
  const coverImage = formData.get("coverImage");
  const isPublish = isEmptyOrNotExist(formData.get("isPublish"));
  
  // Checking is post slug (generation form post title) already exists.
  // If exist, throw error; user must find another name.
  const post = await getPostBySlug(slug!.toString());
  if (post) {
    return json(
      {
        errors: {
          ...defaultErrorObj,
          slug: "This title or slug already taken",
        },
      },
      { status: 400 }
    );
  }

  if (isEmptyOrNotExist(title)) {
    return json(
      { errors: { ...defaultErrorObj, title: "Title is required" } },
      { status: 400 }
    );
  }

  if (isEmptyOrNotExist(preface)) {
    return json(
      { errors: { ...defaultErrorObj, preface: "Preface is required" } },
      { status: 400 }
    );
  }

  if (isEmptyOrNotExist(body)) {
    return json(
      { errors: { ...defaultErrorObj, body: "Body is required" } },
      { status: 400 }
    );
  }

  // Handle upload image
  if (isEmptyOrNotExist(coverImage)) {
    return json (
      { errors: { ...defaultErrorObj, coverImage: "Fail to upload your cover image. It's require. Please try again!" } },
      { status: 400 }
    )
  }

  // Create new post
  const newPost = await createPost({
    title,
    preface,
    body,
    coverImage,
    isPublish,
    userId,
    slug: convertUrlSlugFormat(title),
  });

  return redirect(`/posts/${newPost.slug}`);
}

export default function NewNotePage() {
  const [notePreview, setNotePreview] = React.useState({
    title: "",
    preface: "",
    body: "",
    slug: "",
  });

  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const prefaceRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const slugRef = React.useRef<HTMLInputElement>(null);

  const isTitleError = !isEmptyOrNotExist(actionData?.errors?.title);
  const isPrefaceError = !isEmptyOrNotExist(actionData?.errors?.preface);
  const isBodyError = !isEmptyOrNotExist(actionData?.errors?.body);
  const isSlugError = !isEmptyOrNotExist(actionData?.errors?.slug);
  const isUploadCoverImageError = !isEmptyOrNotExist(
    actionData?.errors?.coverImage
  );

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
    if (isSlugError) {
      slugRef.current?.focus();
    }
  });

  return (
    <>
      <div className="flex h-full">
        <div className="h-full flex-1 border-r-2 border-gray-400">
          <Form
            encType="multipart/form-data"
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
            id="form-editor"
          >
            <div className="w-100 flex h-8 items-center justify-between bg-slate-600 p-2 text-sm text-white">
              <a href={ROUTERS.DASHBOARD}>Return</a>
              <div className="flex items-center gap-4">
                <SwitchButton label="Publish" name="isPublish" />
                <button type="submit" className="p-2 text-sm text-white">
                  <strong>Save</strong>
                </button>
              </div>
            </div>
            <div className="flex h-full flex-1 flex-col px-1">
              {/* ---Cover image --- */}
              <label
                htmlFor="img-field"
                className="text-stale flex w-full flex-col gap-1 text-sm"
              >
                Upload your post cover image here
                <input
                  id="img-field"
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  readOnly
                />
                {isUploadCoverImageError && (
                  <div className="pt-1 text-red-700" id="body-error">
                    {actionData!.errors.coverImage}
                  </div>
                )}
              </label>

              {/* ---Title--- */}
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
                  required
                />
                {isTitleError && (
                  <div className="pt-1 text-red-700" id="title-error">
                    {actionData!.errors.title}
                  </div>
                )}
                {isSlugError && (
                  <div className="pt-1 text-red-700" id="title-error">
                    {actionData!.errors.slug}. Please find another one.
                  </div>
                )}
              </label>

              {/* ---Hidden slug--- */}
              <input
                name="slug"
                className="hidden"
                readOnly
                value={convertUrlSlugFormat(notePreview.title)}
              />

              {/* ---Preface--- */}
              <label className="text-stale flex w-full flex-col gap-1 text-sm">
                Preface
                <input
                  name="preface"
                  className="w-full rounded-md border-2 border-gray-100 px-3 text-lg leading-loose  text-black"
                  aria-invalid={isPrefaceError ? true : undefined}
                  aria-errormessage={
                    isPrefaceError ? "preface-error" : undefined
                  }
                  onChange={(e) =>
                    setNotePreview((prev) => ({
                      ...prev,
                      preface: e.target.value,
                    }))
                  }
                  required
                />
                {isPrefaceError && (
                  <div className="pt-1 text-red-700" id="title-error">
                    {actionData!.errors.preface}
                  </div>
                )}
              </label>

              {/* ---Body--- */}
              <label
                className="text-stale flex w-full flex-1 flex-col gap-1 text-sm"
                style={{}}
              >
                Body
                <textarea
                  ref={bodyRef}
                  name="body"
                  rows={15}
                  className="w-full flex-1 rounded-md border-2 border-gray-100 py-2 px-3 text-sm leading-6 text-black"
                  aria-invalid={isBodyError ? true : undefined}
                  aria-errormessage={isBodyError ? "body-error" : undefined}
                  onChange={(e) =>
                    setNotePreview((prev) => ({
                      ...prev,
                      body: e.target.value,
                    }))
                  }
                  required
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
        <div className="flex h-full flex-1 flex-col border-l-2 border-gray-400">
          <div className="w-100 flex h-8 items-center justify-center bg-slate-600 p-2 text-sm text-white">
            <h2 className="">Post preview</h2>
          </div>
          <div className="relative mt-3 flex flex-1 flex-col px-1">
            <h2 className="min-h-[3rem] text-center text-3xl font-bold">
              {notePreview.title ? (
                notePreview.title
              ) : (
                <em className="text-slate-400">Your title goes here</em>
              )}
            </h2>
            <h3 className="my-4 border-l-2 border-slate-200 pl-2 text-lg text-slate-500">
              {notePreview.preface ? (
                notePreview.preface
              ) : (
                <em className="text-slate-400">Your preface goes here</em>
              )}
            </h3>
            <label className="text-stale my-3 flex w-full flex-col gap-1 text-sm">
              <em>Your preview post slug goes here</em>
              <input
                readOnly
                className="text-gray w-full rounded-md border-2 border-gray-100 px-3 text-sm italic leading-loose"
                aria-invalid={isSlugError ? true : undefined}
                aria-errormessage={isSlugError ? "preface-error" : undefined}
                value={convertUrlSlugFormat(notePreview.title)}
                disabled
              />
            </label>
            <em className="text-stale my-3 text-sm">
              Your preview post content goes here
            </em>
            <div className="relative h-full flex-1 overflow-scroll rounded border-2 border-gray-100">
              <TextWithMarkdown
                customClasses="flex-1 text-xs absolute"
                text={notePreview.body}
              />
            </div>
          </div>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.onload = function() {
            const formEditorInitialEntries = new FormData(document.getElementById('form-editor')).entries();
            const formEditorDataInitial = Array.from(formEditorInitialEntries, ([x,y]) => x.toString() + y.toString()).join('');

            window.addEventListener("beforeunload", function (e) {
                const formEditorCurrentlyEntries = new FormData(document.getElementById('form-editor')).entries();
                const formEditorDataCurrently = Array.from(formEditorCurrentlyEntries, ([x,y]) => x.toString() + y.toString()).join('');
                
                const isFormDirty = formEditorDataInitial !== formEditorDataCurrently;
                if (!isFormDirty) {
                    return undefined;
                }
                
                const confirmationMessage = 'It looks like you have been editing something. '
                                        + 'If you leave before saving, your changes will be lost.';
        
                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            });
          };`,
        }}
      />
    </>
  );
}
