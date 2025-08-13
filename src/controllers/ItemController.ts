import { container } from "tsyringe";
import z from "zod";
import { ItemService } from "../services/ItemService";
import { Request, Response } from "express";


/**
 * validation
 */
const StoreItemRequest = z.object({
    name: z.string(),
    weight: z.number()
})


/**
 * services
 */
const itemService = container.resolve(ItemService)

/**
 * ItemController Class
 */
export class ItemController
{
    static async create(req: Request, res: Response)
    {
        try {
            const validated = StoreItemRequest.parse(req.body)
            const item = await itemService.create(validated)

            return res.status(201).json(item)
        } catch (err: any) {
            return res.status(400).json({ error: err.message })
        }
    }

    static async list(req: Request, res: Response)
    {
        try {
            const items = await itemService.getAll();
            return res.status(200).json(items)
        } catch (err: any) {
            return res.status(500).json({ error: err.message })
        }
    }
}