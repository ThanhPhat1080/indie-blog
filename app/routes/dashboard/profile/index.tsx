import type { User } from "@prisma/client";
import { Link, useOutletContext } from "@remix-run/react";
import { CloudinaryImageLoader } from "~/components";
import { isEmptyOrNotExist } from "~/utils";

export default function Profile() {
  const user = useOutletContext<User>();

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="my-2 mx-auto">
        <CloudinaryImageLoader
          className="h-60 w-60 rounded-full"
          src={user.avatar || ""}
          height="240"
          width="240"
          alt={user.name + "-avatar"}
          responsive={[
            {
              size: {
                width: 200,
              },
              maxWidth: 800,
            },
          ]}
        />
      </div>
      <p className="my-2 text-center text-2xl">{user.name}</p>
      <hr />
      <div className="flex flex-col gap-3 text-lg">
        {!isEmptyOrNotExist(user.bio) && (
          <p className="my-2 inline-flex gap-2">
            <svg
              height="16"
              viewBox="0 0 16 16"
              width="16"
              style={{ marginTop: 6 }}
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
              ></path>
            </svg>
            <em className="flex-1">{user.bio}</em>
          </p>
        )}

        <p className="my-2 inline-flex items-center gap-2">
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z"
            />
          </svg>
          <span className="flex-1">{user.email}</span>
        </p>
        {!isEmptyOrNotExist(user.twitter) && (
          <p className="my-2 inline-flex items-center gap-2">
            <svg height="16" viewBox="0 0 273.5 222.3" width="16">
              <title>Twitter</title>
              <path
                d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1"
                fill="#fff"
              />
            </svg>
            <a
              href={`https://twitter.com/${user.twitter}`}
              className="flex-1 text-sky-500 hover:underline"
              target="blank"
            >
              <em>@{user.twitter}</em>
            </a>
          </p>
        )}
      </div>
      <Link
        to="edit"
        prefetch="intent"
        title="Edit profile"
        className="my-2 mb-2 w-full rounded-lg border border-gray-200 bg-white py-2.5 px-5 text-center text-sm font-medium dark:text-gray-900 hover:bg-cyan-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 bg-cyan-300 dark:text-gray-400 dark:hover:bg-cyan-700 dark:hover:text-white dark:focus:ring-gray-700"
      >
        Edit profile
      </Link>
    </div>
  );
}
