import { Link } from "@remix-run/react";
import ROUTERS from "~/constants/routers";

export default function PostPagePreview() {
  return (
    <h2 className="m-10 text-2xl dark:text-slate-300 text-slate-600">
      Select post to preview. Or{" "}
      <Link
        title="Create new post"
        className="text-sky-500 hover:underline"
        to={`${ROUTERS.DASHBOARD}/formEditor-test`}
      >
        Create new one here
      </Link>
      .
    </h2>
  );
}
