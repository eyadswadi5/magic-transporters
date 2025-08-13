import { Request, Response } from "express";
import z from "zod";
import { MoverService } from "../services/MoverService";
import { container } from "tsyringe";

/**
 * Validation
 */
const StoreMoverRequest = z.object({
    weight_limit: z.number().nonnegative(),
});

const LoadItemRequest = z.object({
    item_ids: z.array(z.string()).min(1)
})

/**
 * services
 */
const moverService = container.resolve(MoverService)

/**
 * MoverController class
 */
export class MoverController 
{
    static async create(req: Request, res: Response) {
        try {
            const validated = StoreMoverRequest.parse(req.body)
            const mover = await moverService.create(validated)
            return res.status(201).json(mover);
        } catch (err: any) {
            return res.status(400).json({ error: err.message })
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const movers = await moverService.getAll()
            return res.status(200).json(movers)
        } catch (err: any) {
            return res.status(500).json({ error: err.message })
        }
    }

    static async loadItems(req: Request, res: Response) {
        try {
            const validated = LoadItemRequest.parse(req.body);
            const mover_id = req.params.id
            const mover = await moverService.load(mover_id, validated.item_ids);
    
            return res.status(200).json(mover)
        } catch (err: any) {
            return res.status(500).json({ error: err.message })
        }
    }

    static async startMission(req: Request, res: Response) {
        try {
            const mover = await moverService.startMission(req.params.id)
            return res.status(200).json(mover)
        } catch (err: any) {
            return res.status(400).json({ error: err.message })
        }
    }

    static async endMission(req: Request, res: Response) {
        try {
            const mover = await moverService.endMission(req.params.id)
            return res.status(200).json(mover)
        } catch (err: any) {
            return res.status(400).json({ error: err.message })
        }
    }

    static async leaderboard(req: Request, res: Response) {
        try {
            const data = await moverService.leaderboard();

            return res.status(200).json(data)
        } catch (err: any) {
            return res.status(500).json({ error: err.message })
        }
    }
}