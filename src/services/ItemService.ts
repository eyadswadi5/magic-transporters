import { injectable } from "tsyringe";
import { Item, ItemInterface } from "../models/Item";

@injectable()
export class ItemService 
{
    async create(data: {name: string, weight: number}): Promise<ItemInterface>
    {
            const item = Item.create(data);
            return item
    }

    async getAll(): Promise<ItemInterface[]>
    {
        const items = Item.find().sort({ createdAt: -1 })
        return items;
    }
}