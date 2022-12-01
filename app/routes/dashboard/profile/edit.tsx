import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, Link, useActionData, useOutletContext } from "@remix-run/react";
import ROUTERS from "~/constants/routers";
import { updateUserProfile } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { isEmptyOrNotExist } from "~/utils";
import type { User } from "@prisma/client";
import {
  json,
  redirect,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import React from "react";
import { uploadImageHandler } from "~/cloudinaryUtils.server";
import { CloudinaryImageLoader } from "~/components";

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

export async function action({ request }: ActionArgs) {
  let defaultErrorObj = {
    name: null,
    avatar: null,
    serverError: null,
  };
  try {
    const userId = await requireUserId(request);

    // Collect form data
    const formData = await parseMultipartFormData(
      request,
      uploadImageHandler("avatar")
    );

    const name = formData.get("name");
    const bio = formData.get("bio") as string;
    const twitter = formData.get("twitter") as string;
    const avatar = formData.get("avatar") as string;
    console.log("avatar", avatar);
    if (isEmptyOrNotExist(name)) {
      return json(
        {
          errors: { ...defaultErrorObj, name: "Name is required" },
        },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserProfile({
      id: userId,
      name,
      bio,
      twitter,
      avatar,
    });

    if (!updatedUser) {
      throw new Error("Can not update user. Please try again!");
    }

    return redirect(`${ROUTERS.DASHBOARD}/profile`);
  } catch (e: any) {
    return json(
      { errors: { ...defaultErrorObj, serverError: e?.message } },
      { status: 400 }
    );
  }
}

export default function ProfileEdit() {
  const actionData = useActionData<typeof action>();
  const user = useOutletContext<User>();
  const [avatarPreview, setAvatarPreview] = React.useState("");

  const isNameError = !isEmptyOrNotExist(actionData?.errors?.name);
  const isServerError = !isEmptyOrNotExist(actionData?.errors?.serverError);

  const onUploadAvatarImage = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setAvatarPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setAvatarPreview(objectUrl);
  };

  return (
    <div className="h-full w-full">
      <Form method="patch" encType="multipart/form-data">
        <div className="text-md my-2 mx-auto flex flex-col gap-4">
          <div className="my-2 mx-auto">
            {avatarPreview ? (
              <img
                className="h-60 w-60 rounded-full"
                src={avatarPreview}
                height="240"
                width="240"
                alt={user.name + "-avatar"}
              />
            ) : (
              <CloudinaryImageLoader
                className="h-60 w-60 rounded-full"
                src={user.avatar || ""}
                height="240"
                width="240"
                alt={user.name + "-avatar"}
                responsive={[
                  {
                    size: {
                      width: 100,
                    },
                    maxWidth: 800,
                  },
                ]}
              />
            )}
          </div>
          <label
            htmlFor="avatar-field"
            className="text-stale flex w-full flex-col gap-1 text-sm"
          >
            Upload your avatar image here
            <input
              id="avatar-field"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={onUploadAvatarImage}
            />
          </label>

          <label className="flex flex-col gap-1">
            Name
            <input
              name="name"
              autoFocus
              required
              className="w-full rounded-md border-2 border-gray-100 px-3 text-lg leading-loose text-black"
              aria-invalid={isNameError ? true : undefined}
              aria-errormessage={isNameError ? "name-error" : undefined}
              defaultValue={user?.name || ""}
            />
          </label>
          <label className="flex flex-col gap-1">
            Bio
            <textarea
              name="bio"
              className="w-full rounded-md border-2 border-gray-100 px-3 text-lg leading-loose text-black"
              rows={5}
              defaultValue={user?.bio || ""}
            />
          </label>
          <label className="flex flex-col gap-1">
            Twitter
            <input
              name="twitter"
              className="w-full rounded-md border-2 border-gray-100 px-3 text-lg leading-loose text-black"
              defaultValue={user?.twitter || ""}
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
