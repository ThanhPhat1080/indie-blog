import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getPostListItems } from "~/models/note.server";
import stylesMarkdowPreview from "~/styles/markdown-preview.css";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const postListItems = await getPostListItems({ userId });
  return json({ postListItems });
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesMarkdowPreview }];
};

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

      <main className="flex h-full">
        <div className="h-full w-80 border-r bg-gray-200">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Note
          </Link>
          <hr />
          {data.postListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.postListItems.map((post) => (
                <li key={post.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `flex flex-col border-b p-4 text-xl ${
                        isActive ? "bg-gray-500" : ""
                      }`
                    }
                    to={post.slug}
                  >
                    <strong className="my-2 text-lg">📝 {post.title}</strong>
                    <em className="text-sm">{post.preface}</em>
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
