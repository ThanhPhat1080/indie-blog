import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getUserById } from "~/models/user.server";

import { requireUserId } from "~/session.server";

// TODO: required login user
// export const loader = async ({ request, params }: LoaderArgs) => {
//   const userId = await requireUserId(request);
//   const user = await getUserById(userId);
//   return json({ user });
// };

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
