import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getPostListItems } from "~/models/note.server";
import { PostCard } from "~/components";
import type { Post } from "@prisma/client";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const postListItems: Post[] = await getPostListItems({ userId });

  return json({ postListItems });
}

export default function PostPage() {
  const { postListItems } = useLoaderData<typeof loader>();

  return (
    <div className="flex">
      <div className="sticky top-0 h-[calc(_100vh_-_120px_)] max-h-screen w-96 border-spacing-2 overflow-y-auto overflow-x-hidden border-r-2 border-gray-300 pt-5 pb-[100px] xl:w-96">
        <nav className="flex min-h-[calc(_100vh_-_240px_)] flex-col px-6 pb-10">
          {postListItems.map((post) => (
            <div key={post.id} className="relative my-2">
              <NavLink to={post.slug}>
                {({ isActive }) =>
                  isActive ? (
                    <span className="absolute left-[-6px] top-[-8px] z-20 flex h-5 w-5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex h-5 w-5 rounded-full bg-orange-500"></span>
                    </span>
                  ) : null
                }
              </NavLink>
              <PostCard
                {...post}
                createdAt={new Date(post.createdAt)}
                updatedAt={new Date(post.updatedAt)}
              />
            </div>
          ))}
        </nav>
        <div
          className="fixed bottom-0 left-0 w-full border-r-2 border-t-2 border-gray-300 bg-slate-800 p-6"
          style={{ width: "inherit" }}
        >
          <Link
            to="./../formEditor-test"
            className="m-auto inline-flex w-full items-center justify-center rounded-md bg-green-500 p-2 text-center text-xl text-white duration-300 ease-in-out hover:scale-105 hover:bg-green-600 focus:scale-110 focus:outline-none focus:ring-green-800 active:scale-100 active:bg-green-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enableBackground="new 0 0 50 50"
              height="30px"
              id="Layer_1"
              version="1.1"
              viewBox="0 0 50 50"
              width="30px"
            >
              <rect fill="none" height="50" width="50" />
              <line
                fill="none"
                stroke="#ffffff"
                strokeMiterlimit="10"
                strokeWidth="4"
                x1="9"
                x2="41"
                y1="25"
                y2="25"
              />
              <line
                fill="none"
                stroke="#ffffff"
                strokeMiterlimit="10"
                strokeWidth="4"
                x1="25"
                x2="25"
                y1="9"
                y2="41"
              />
            </svg>
            Create new post
          </Link>
        </div>
      </div>
      <div className="h-[calc(_100vh_-_120px_)] max-h-screen flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
