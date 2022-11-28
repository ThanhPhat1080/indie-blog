import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import marked from "marked";
import sanitizeHtml from "sanitize-html";

import type { Post } from "~/models/note.server";
import { deletePostBySlug, getPostBySlug } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { TextWithMarkdown } from "~/components";
import { isEmptyOrNotExist } from "~/utils";

import remixImageStyles from "remix-image/remix-image.css";
import type { ClientLoader, ImagePosition } from "remix-image";
import Image from "remix-image";
import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import ROUTERS from "~/constants/routers";

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

const numberToHex = (num: number): string =>
  ("0" + Number(num).toString(16)).slice(-2).toUpperCase();
const positionMap: Record<ImagePosition, string> = {
  "center bottom": "south",
  "center center": "center",
  "center top": "north",
  "left bottom": "south_west",
  "left center": "west",
  "left top": "north_west",
  "right bottom": "south_east",
  "right center": "east",
  "right top": "north_east",
  bottom: "south",
  center: "center",
  left: "west",
  right: "east",
  top: "north",
};
export const cloudinaryLoader: ClientLoader = (
  src,
  loaderUrl,
  loaderOptions
) => {
  const params = [];

  if (loaderOptions.background) {
    params.push(
      `b_rgb:${
        numberToHex(loaderOptions.background[0]) +
        numberToHex(loaderOptions.background[1]) +
        numberToHex(loaderOptions.background[2]) +
        numberToHex(loaderOptions.background[3])
      }`
    );
  }

  if (loaderOptions.crop) {
    params.push(`c_crop`);
    params.push(`g_north_west`);
    params.push(`h_${loaderOptions.crop.height}`);
    params.push(`w_${loaderOptions.crop.width}`);
    params.push(`x_${loaderOptions.crop.x}`);
    params.push(`y_${loaderOptions.crop.y}`);
  }

  if (loaderOptions.rotate) {
    params.push(`a_${loaderOptions.rotate}`);
  }

  if (loaderOptions.blurRadius) {
    params.push(`e_blur:${loaderOptions.blurRadius}`);
  }

  if (loaderOptions.fit === "outside") {
    params.push("c_fit");

    if (loaderOptions.width && loaderOptions.height) {
      params.push(`w_${Math.max(loaderOptions.width, loaderOptions.height)}`);
      params.push(`h_${Math.max(loaderOptions.width, loaderOptions.height)}`);
    } else if (loaderOptions.width) {
      params.push(`w_${loaderOptions.width}`);
    } else if (loaderOptions.height) {
      params.push(`h_${loaderOptions.height}`);
    }
  } else {
    if (loaderOptions.fit === "contain") {
      params.push("c_pad");
    } else if (loaderOptions.fit === "cover") {
      params.push("c_fill");
    } else if (loaderOptions.fit === "fill") {
      params.push("c_scale");
    } else if (loaderOptions.fit === "inside") {
      params.push("c_fit");
    }

    if (loaderOptions.width) {
      params.push(`w_${loaderOptions.width}`);
    }

    if (loaderOptions.height) {
      params.push(`h_${loaderOptions.height}`);
    }
  }

  if (loaderOptions.position) {
    params.push(
      `g_${positionMap[loaderOptions.position as ImagePosition] || "center"}`
    );
  }

  params.push(`q_${loaderOptions.quality || "auto"}`);

  if (loaderOptions.contentType) {
    params.push(
      "f_",
      loaderOptions.contentType.replace("image/", "").replace("jpeg", "jpg")
    );
  } else {
    params.push("f_auto");
  }

  const paramsString = params.join(",") + "/";
  return `${loaderUrl}${paramsString}${normalizeSrc(src)}`;
};

export const links = () => [{ rel: "stylesheet", href: remixImageStyles }];

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
    <div>
      <div className="w-100 flex h-8 items-center justify-end gap-4 bg-slate-600 p-2 text-sm text-white">
        <div className="flex items-center gap-4">
          <Link to={`./formEditor?id=${post.id}`}>Edit</Link>
          <Form method="delete">
            <button type="submit" className="p-2 text-sm text-white">
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
              <p className="px-3 text-lg italic text-gray-600">
                {post.preface}
              </p>
            </div>
          </section>
          <Image
            alt={post.title}
            loaderUrl={ROUTERS.LOADER_IMAGE}
            src={post?.coverImage ?? ''}
            loader={cloudinaryLoader}
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
            <TextWithMarkdown text={sanitizeHtml(marked(post.body))} />
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
