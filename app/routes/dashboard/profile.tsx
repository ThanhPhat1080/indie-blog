import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLocation, useOutletContext } from "@remix-run/react";
import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";

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
export default function Profile() {
  const user = useOutletContext<User>();

  return (
    <div className="border-r-1 mx-auto my-10 flex md:w-1/2 lg:w-1/3 sm:w-full  flex-col border-gray-500 pr-3">
      <div className="my-2 mx-auto">
        <img
          className="h-60 w-60 rounded-full"
          src="https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg"
          alt={user.name + '-avatar'}
        />
      </div>
      <Outlet context={user} />
      
    </div>
  );
}
