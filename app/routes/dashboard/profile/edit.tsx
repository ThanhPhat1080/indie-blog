import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useOutletContext,
} from "@remix-run/react";
import ROUTERS from "~/constants/routers";
import { updateUserProfile, User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { isEmptyOrNotExist } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);

  if (!user) {
    return json({
      error: "Can not found user. Please try to sign out and re-login!",
      status: 400,
      user: null,
    });
  }

  return json({ user, error: null, status: 200 });
};

export const action = async ({ request }: ActionArgs) => {
  let defaultErrorObj = {
    name: null,
    avatar: null,
    twitter: null,
    bio: null,
    serverError: null,
  };
  try {
    const userId = await requireUserId(request);
    const formData = await request.formData();

    const name = formData.get("name");
    const bio = formData.get("bio");
    const twitter = formData.get("twitter");

    if (isEmptyOrNotExist(name)) {
      return json(
        { errors: { ...defaultErrorObj, name: "Name is required" } },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserProfile({
      id: userId,
      name,
      bio,
      twitter,
    });

    if (!updatedUser) {
      throw new Error("Can not update user. Please try again!");
    }

    return redirect(`${ROUTERS.DASHBOARD}/profile`);
  } catch (e: any) {
    return json({ errors: { ...defaultErrorObj, serverError: e?.message } });
  }
};

export default function ProfileEdit() {
  const actionData = useActionData<typeof action>();

  const user = useOutletContext<User>();

  const isNameError = !isEmptyOrNotExist(actionData?.errors?.name);
  const isServerError = !isEmptyOrNotExist(actionData?.errors?.serverError);

  return (
    <div className="h-full w-full">
      <Form method="patch">
        <div className="text-md my-2 mx-auto flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            Name
            <input
              name="name"
              autoFocus
              required
              className="w-full rounded-md border-2 border-gray-100 px-3 text-lg leading-loose text-black"
              aria-invalid={isNameError ? true : undefined}
              aria-errormessage={isNameError ? "name-error" : undefined}
              defaultValue={user.name}
            />
          </label>
          <label className="flex flex-col gap-1">
            Bio
            <textarea
              name="bio"
              className="w-full rounded-md border-2 border-gray-100 px-3 text-lg leading-loose text-black"
              rows={5}
              defaultValue={user.bio}
            />
          </label>
          <label className="flex flex-col gap-1">
            Twitter
            <input
              name="twitter"
              className="w-full rounded-md border-2 border-gray-100 px-3 text-lg leading-loose text-black"
              defaultValue={user.twitter}
            />
          </label>
          {isServerError && (
            <p className="my-2 text-red-400">
              {actionData?.errors.serverError}
            </p>
          )}
          <div className="mx-auto mt-5 flex w-full items-center justify-end gap-4">
            <Link to="../" className="hover:underline">
              Cancel
            </Link>
            <button
              type="submit"
              className=" inline-flex w-auto items-center justify-center self-end rounded-md bg-green-500 p-2 px-5 text-center text-xl text-white duration-300 ease-in-out hover:scale-105 hover:bg-green-600 focus:scale-110 focus:outline-none focus:ring-green-800 active:scale-100 active:bg-green-800"
            >
              Save
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
