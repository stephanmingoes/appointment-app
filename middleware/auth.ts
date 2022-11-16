import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function auth(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "You are not authenticated" });

    try {
      const data = jwt.verify(
        token as string,
        process.env.JWT_SECRET as string
      );

      req.body = { ...req.body };
      req.body.id = (data as { id: string }).id;
      return await handler(req, res);
    } catch {
      res.status(403).json({ message: "You are unauthorized" });
    }
  };
}
