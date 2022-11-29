import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getUserById } from "~/models/user.server";

import { requireUserId } from "~/session.server";

import remixImageStyles from "remix-image/remix-image.css";

export const links = () => [{ rel: "stylesheet", href: remixImageStyles }];

// TODO: required login user
export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);

  return json({ user });
};

const Dashboard = () => {
  return (
    <div className="flex h-full bg-slate-800 text-white">
      <div className="flex-1 flex-col">
        <nav className="relative flex w-full gap-3 border-b-4 border-gray-500 text-md">
          <NavLink
            to="profile"
            className="relative inline-flex cursor-pointer items-center gap-4 py-2 px-6 text-center"
          >
            {({ isActive }) => (
              <>
                <svg
                  aria-hidden="true"
                  height="16"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="16"
                  data-view-component="true"
                >
                  <path
                    fill={isActive ? "rgb(251 146 60)" : "#fff"}
                    fillRule="evenodd"
                    d="M10.5 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm.061 3.073a4 4 0 10-5.123 0 6.004 6.004 0 00-3.431 5.142.75.75 0 001.498.07 4.5 4.5 0 018.99 0 .75.75 0 101.498-.07 6.005 6.005 0 00-3.432-5.142z"
                  ></path>
                </svg>
                <span
                  className={isActive ? "text-orange-400" : "text-gray-200"}
                >
                  Your Profile
                </span>
                {isActive && (
                  <div className="absolute bottom-[-4px] left-0 h-[4px] w-full bg-orange-400" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="posts"
            className="relative inline-flex cursor-pointer items-center gap-4 py-2 px-6 text-center"
          >
            {({ isActive }) => (
              <>
                <svg
                  aria-hidden="true"
                  height="18"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="18"
                  data-view-component="true"
                  className=""
                >
                  <path
                    fill={isActive ? "rgb(251 146 60)" : "#fff"}
                    fillRule="evenodd"
                    d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm8.755 3a2.25 2.25 0 012.25-2.25H14.5v9h-3.757c-.71 0-1.4.201-1.992.572l.004-7.322zm-1.504 7.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574z"
                  />
                </svg>
                <span
                  className={isActive ? "text-orange-400" : "text-gray-200"}
                >
                  Your posts
                </span>
                {isActive && (
                  <div className="absolute bottom-[-4px] left-0 h-[4px] w-full bg-orange-400" />
                )}
              </>
            )}
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
