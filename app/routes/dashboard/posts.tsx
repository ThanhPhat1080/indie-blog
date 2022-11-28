import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getPostListItems } from "~/models/note.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const postListItems = await getPostListItems({ userId });

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  return json({ postListItems, editingPostId: id });
}


export default function PostPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Notes</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex flex-1 flex-row">
        <aside className="h-full w-80 border-r bg-gray-100">
          <Link to="./formEditor" className="block p-4 text-xl text-blue-500">
            + New Note
          </Link>
          <hr />
          {data.postListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.postListItems.map((post) => {
                const isEditing = data.editingPostId === post.id;
                return (
                  <li key={post.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `flex flex-col relative border-b border-gray-200 p-4 text-xl ${
                          isActive ? "bg-gray-200" : ""
                        } ${isEditing ? 'bg-sky-100' : ''}`
                      }
                      to={post.slug}
                    >
                      {isEditing && (
                        <div className="flex gap-3 items-center absolute top-0">
                          <span className="flex h-3 w-3 relative">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                          
                          </span>
                          <em className="text-xs text-sky-400">Editing...</em>
                        </div>
                      )}
                      <strong className="my-2 text-lg">📝 {post.title}</strong>
                      <em className="text-sm">{post.preface}</em>
                    </NavLink>
                  </li>
                );
              })}
            </ol>
          )}
        </aside>

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
