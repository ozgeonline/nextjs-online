// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { url } = req.query;

//   if (!url || typeof url !== "string") {
//     res.status(404).json({ error: "Missing or invalid URL" });
//     return;
//   }

//   try {
//     const response = await fetch(url);
//     const contentType = response.headers.get("content-type");

//     res.setHeader("Content-Type", contentType || "application/octet-stream");
//     res.status(response.status).send(await response.arrayBuffer());
//   } catch (error) {
//     console.log(error);
//   }
// }
