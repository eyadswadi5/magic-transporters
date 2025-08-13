import { Router } from "express";
import { MoverController } from "../controllers/MoverController";
import { ItemController } from "../controllers/ItemController";


const router = Router();

/**
 * ------------------------------------------
 * MoverController
 * ------------------------------------------
 */

/**
 * @openapi
 * /api/movers:
 *   post:
 *     summary: Create a Mover
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [weight_limit]
 *             properties:
 *               weight_limit: { type: number }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List Movers
 *     responses:
 *       200: { description: OK }
 */
router.post("/movers", MoverController.create);
router.get("/movers", MoverController.list);

/**
 * @openapi
 * /api/movers/{id}/items:
 *   post:
 *     summary: Load items onto a mover (additive); switches state to loading
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [item_ids]
 *             properties:
 *               item_ids:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.put("/movers/:id/items", MoverController.loadItems)

/**
 * @openapi
 * /api/movers/{id}/start-mission:
 *   post:
 *     summary: Start a mission; switches state to on-mission and prevents further loading
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.put("/movers/:id/start-mission", MoverController.startMission)

/**
 * @openapi
 * /api/movers/{id}/end-mission:
 *   post:
 *     summary: End a mission; unloads all items and returns to resting
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.put("/movers/:id/end-mission", MoverController.endMission)

/**
 * @openapi
 * /api/movers/leaderboard:
 *   get:
 *     summary: Leaderboard of movers by missions completed
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: number, default: 10 }
 *     responses:
 *       200: { description: OK }
 */
router.get("/movers/leaderboard", MoverController.leaderboard)

/**
 * -----------------------------------------
 * ItemController
 * -----------------------------------------
 */

/**
 * @openapi
 * /api/items:
 *   post:
 *     summary: Create a Item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, weight]
 *             properties:
 *               name: { type: string }
 *               weight: { type: number }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: List Items
 *     responses:
 *       200: { description: OK }
 */
router.post("/items", ItemController.create)
router.get("/items", ItemController.list)

export default router;