import { Types } from "mongoose";
import { Mover, MoverInterface } from "../models/Mover";
import { injectable } from "tsyringe"
import { Item } from "../models/Item";
import { ActivityLog } from "../models/ActivityLog";

@injectable()
export class MoverService {
    async create(data: { weight_limit: number }): Promise<MoverInterface> {
        const mover = new Mover(data)
        return mover.save()
    }

    async getAll(): Promise<MoverInterface[]> {
        const movers = Mover.find().sort({ createdAt: -1 })
        return movers;
    }

    async load(mover_id: string, item_ids: string[]): Promise<MoverInterface> {
        const mover = await Mover.findById(mover_id)

        if (!mover)
            throw new Error("Mover not found");

        if (mover.quest_state === "on-mission")
            throw new Error("Cannot load items while on mission")

        const unq_item_ids = [...new Set(item_ids)]
            .map(id => new Types.ObjectId(id))

        mover.loadedItems = Array.from(
            new Set([
                ...mover.loadedItems.map(id => id.toString()),
                ...unq_item_ids.map(id => id.toString())
            ])
        ).map(id => new Types.ObjectId(id))

        const items = await Item.find(
            { _id: { $in: mover.loadedItems } },
            { weight: 1 }
        );

        const total_weight = items.reduce(
            (sum: number, item: any) => sum + (item.weight ?? 0), 0)

        if (total_weight > mover.weight_limit)
            throw new Error("Weight limit exceeded")

        mover.quest_state = 'loading'
        mover.save()

        // activity log here
        await ActivityLog.create({ 
            mover: mover._id, 
            type: 'loading', 
            itemsSnapshot: mover.loadedItems 
        });

        return mover.populate('loadedItems');
    }

    async startMission(mover_id: string): Promise<MoverInterface> {
        const mover = await Mover.findById(mover_id);

        if (!mover)
            throw new Error("Mover not found");

        if (mover.quest_state === "on-mission")
            throw new Error("Already on-mission")

        mover.quest_state = "on-mission"
        mover.save()

        // activity log
        await ActivityLog.create({ 
            mover: mover._id, 
            type: 'start-mission', 
            itemsSnapshot: mover.loadedItems
        });

        return mover.populate('loadedItems');
    }

    async endMission(mover_id: string): Promise<MoverInterface> {
        const mover = await Mover.findById(mover_id);

        if (!mover)
            throw new Error("Mover not found");

        if (mover.quest_state === "resting")
            throw new Error("No mission assigned")

        mover.quest_state = "resting"
        mover.loadedItems = []
        mover.save()

        // activity log
        await ActivityLog.create({ 
            mover: mover._id, 
            type: 'end-mission', 
            itemsSnapshot: mover.loadedItems 
        });

        return mover;
    }

    async leaderboard(): Promise<any> {
        const results = await ActivityLog.aggregate([
            { $match: { type: 'end-mission' } },
            { $group: { _id: '$mover', missionsCompleted: { $sum: 1 } } },
            { $sort: { missionsCompleted: -1 } },
            {
                $lookup: {
                    from: 'movers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'mover'
                }
            },
            { $unwind: '$mover' },
            {
                $project: {
                    _id: 0,
                    mover_id: '$mover._id',
                    mover_weight_limie: '$mover.weight_limit',
                    missionsCompleted: 1,
                }
            }
        ]);
        return results;
    }
}