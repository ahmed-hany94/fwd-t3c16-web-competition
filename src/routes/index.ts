import express, { Router } from "express";
import { createHello } from "./controllers/helloCtrl";

const router: Router = express.Router();

router.route("/").get(createHello);

export { router };
