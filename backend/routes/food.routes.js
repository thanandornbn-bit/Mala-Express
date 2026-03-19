import express from "express"
import * as controller from "../controllers/food.controller.js"
import { verifyAdmin } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/", controller.getAllFoods)
router.get("/:id", controller.getFoodById)
router.post("/", verifyAdmin, controller.createFood)
router.put("/:id", verifyAdmin, controller.updateFood)
router.delete("/", verifyAdmin, controller.deleteAllFoods)
router.delete("/:id", verifyAdmin, controller.deleteFood)

export default router