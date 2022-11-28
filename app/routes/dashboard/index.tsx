import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getUserById } from "~/models/user.server";

import { requireUserId } from "~/session.server";
import ROUTERS from "~/constants/routers";

// TODO: required login user
export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  return json({ user });
};

const Dashboard = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Hello, {data.user?.name}</h1>
      <Link to={`${ROUTERS.DASHBOARD}/posts/formEditor`}>new </Link>
    </div>
  );
};

export default Dashboard;
