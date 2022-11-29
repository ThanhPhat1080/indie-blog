import { Link } from "@remix-run/react";
import ROUTERS from "~/constants/routers";

export default function PostPagePreview() {
  return (
    <h2 className="m-10 text-2xl text-white">
      Select post to preview. Or{" "}
      <Link
        className="text-sky-500 hover:underline"
        to={`${ROUTERS.DASHBOARD}/formEditor-test`}
      >
        Create new one here
      </Link>
      .
    </h2>
  );
}
