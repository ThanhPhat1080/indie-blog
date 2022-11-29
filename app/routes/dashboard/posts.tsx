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
      <div className="sticky top-0 h-[calc(_100vh_-_50px_)] max-h-screen w-96 border-spacing-2 overflow-y-auto overflow-x-hidden border-r-2 border-gray-300 px-2 py-5 pl-6 pr-3 xl:w-96 xl:pr-5 2xl:w-96 2xl:pr-6">
        <nav className="flex flex-col">
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
        <div className="absolute bottom-0 left-0 w-full border-t-2 border-gray-400 p-4">
          <Link to={"./../formEditor-test"}>
            <button className="m-auto inline-flex w-full items-center justify-center rounded-md bg-green-500 p-2 text-center text-xl text-white hover:bg-green-600 active:bg-green-800">
              Create new post
            </button>
          </Link>
        </div>
      </div>
      <div className="h-[calc(_100vh_-_50px_)] max-h-screen flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
