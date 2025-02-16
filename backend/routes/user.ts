import express from "express"
import { Prisma } from "@prisma/client"
import { login, signUp } from "../controllers/user"
import { polls } from "../controllers/polling"
const router = express.Router()


router.route('/signup').post(signUp)
router.route("/login").get(login);
router.route("/poll").post(polls);
export default router