import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import marked from "marked";
import sanitizeHtml from "sanitize-html";

import type { Post } from "~/models/note.server";
import { deleteNote, getPostBySlug } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { TextWithMarkdown } from "~/components";
import { isEmptyOrNotExist } from "~/utils";

import remixImageStyles from "remix-image/remix-image.css";
import Image, { ClientLoader,ImagePosition } from "remix-image";

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

  const post = await getPostBySlug(params.slug, userId);
  if (isEmptyOrNotExist(post)) {
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


// {
//   asset_id: 'dd4a07b4214ec9f520370036f4eab97a',
//   public_id: 'remix/plierjx0uerkskisnyii',
//   version: 1669565869,
//   version_id: '6e81d92bea00f5e315b775ea35618cda',
//   signature: 'a3d987a5a69ab9aff0ffabd2160eb15b312fa039',
//   width: 1700,
//   height: 1000,
//   format: 'png',
//   resource_type: 'image',
//   created_at: '2022-11-27T16:17:49Z',
//   tags: [],
//   bytes: 350885,
//   type: 'upload',
//   etag: '0f6d54302c42c3ec3a5e4cb7ec1d877d',
//   placeholder: false,
//   url: 'http://res.cloudinary.com/diveoh2pp/image/upload/v1669565869/remix/plierjx0uerkskisnyii.png',
//   secure_url: 'https://res.cloudinary.com/diveoh2pp/image/upload/v1669565869/remix/plierjx0uerkskisnyii.png',
//   folder: 'remix',
//   original_filename: 'file',
//   api_key: '317651382317957'
// }
export default function NoteDetailsPage() {
  const { post } = useLoaderData<typeof loader>() as { post: Post };

  return (
    <div>
      <h2>Cover image</h2>
      {/* <img src={post.coverImage}></img> */}
      <Image
        alt={post.title}
        loaderUrl="https://res.cloudinary.com/diveoh2pp/"
        // src={post.coverImage}
        src="v1669565068/remix/dcci8lkmhnc0oziqpptp.png"
        loader={cloudinaryLoader}
        options={{fit: 'fill'}}
        responsive={[
          {
            size: {
              width: 200,
              height: 200
            },
            maxWidth: 1000
          },{
            size: {
              width: 500,
              height: 500
            },
            maxWidth: 800
          },
        ]}
        dprVariants={[1]}
      />
      <h3 className="text-2xl font-bold">{post.title}</h3>
      <h3 className="text-xl font-bold">{post.preface}</h3>
      <div className="py-6">
        {/* @ts-ignore */}
        <TextWithMarkdown text={sanitizeHtml(marked(post.body))} />
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
