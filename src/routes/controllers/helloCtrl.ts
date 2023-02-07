import { Request, Response } from "express";

const createHello = function (req: Request, res: Response) {
  res.send("<h1>hello, world!</h1>");
};

export { createHello };
