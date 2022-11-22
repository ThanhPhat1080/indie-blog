import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getUserById } from "~/models/user.server";

import { requireUserId } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  return json({ user });
};

const Dashboard = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Dashboard</h1>
      <code>{JSON.stringify(data).toString()}</code>
    </div>
  );
};

export default Dashboard;
