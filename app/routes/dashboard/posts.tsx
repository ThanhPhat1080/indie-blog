import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  PrefetchPageLinks,
  useLoaderData,
} from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getPostListItems } from "~/models/note.server";
import { PostCard } from "~/components";
import type { Post } from "@prisma/client";
import { useState } from "react";
import { isEmptyOrNotExist } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  let url = new URL(request.url);
  let query = url.searchParams.get("q") || undefined;
  const postListItems: Post[] = await getPostListItems({ userId, query });

  return json({ postListItems, query });
}

export default function PostPage() {
  const { postListItems, query } = useLoaderData<typeof loader>();
  const [prefetchSearchQuery, setPrefetchSearchQuery] = useState<string>(
    query || ''
  );

  return (
    <div className="flex">
      <div className="sticky top-0 h-[calc(_100vh_-_120px_)] max-h-screen w-96 border-spacing-2 overflow-y-auto overflow-x-hidden border-r-2 border-slate-600 pt-5 pb-[100px] xl:w-96">
        <nav className="flex min-h-[calc(_100vh_-_240px_)] flex-col px-6 pb-10">
          <Form className="my-4 flex w-full gap-1" action="">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                onChange={(e) => setPrefetchSearchQuery(e.target.value)}
                name="q"
                defaultValue={query}
                type="text"
                key={query}
                id="simple-search"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-sky-500 focus:ring-sky-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Search"
              />
            </div>
            <button
              type="submit"
              className="ml-2 rounded-lg border border-sky-700 bg-sky-700 p-2.5 text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </Form>
          {!isEmptyOrNotExist(prefetchSearchQuery) && (
            <PrefetchPageLinks page={`/?q=${prefetchSearchQuery}`} />
          )}
          {!postListItems.length && <p className="mt-10 text-center">Empty.</p>}
          {(!postListItems.length && prefetchSearchQuery) && <span>Try to type another keyword or you can <Link to='.?q=' className="text-center text-sky-500">clear it now.</Link></span>}
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
          className="fixed bottom-0 left-0 w-full border-r-2 border-t-2 border-slate-600 p-6 dark:bg-slate-800"
          style={{ width: "inherit" }}
        >
          <Link
            title="Create new post"
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
