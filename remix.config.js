/** @type {import('@remix-run/dev').AppConfig} */

// FOR Vercel
module.exports = {
  serverBuildTarget: "vercel",
  // When running locally in development mode, we use the built in remix
  // server. This does not understand the vercel lambda module format,
  // so we default back to the standard build output.
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "api/index.js",
  // publicPath: "/build/",
};

// FOR local
// module.exports = {
//   ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
// };
