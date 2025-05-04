import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

//createRouteHandler: ref: UPLOADTHING_<NAME>

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});