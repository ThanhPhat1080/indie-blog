import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Robot Blog",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {

  const matches = useMatches();

  // If at least one route wants to hydrate, this will return true
  const includeScripts = matches.some(
    (match) => match.handle?.hydrate
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-white dark:bg-slate-800">
        <Outlet />
        <ScrollRestoration />

         {/* include the scripts, or not! */}
         {includeScripts ? <Scripts /> : null}
      </body>
    </html>
  );
}
