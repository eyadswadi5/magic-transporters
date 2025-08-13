import { Document, model, Schema, Types } from "mongoose";

export interface MoverInterface extends Document
{
    weight_limit: number;
    quest_state: string
    loadedItems: Types.ObjectId[]
    createdAt: Date;
    updatedAt: Date;
}

const MoverSchema = new Schema<MoverInterface>({
    weight_limit: {required: true, type: Number, min: 0},
    quest_state: {required: true, type: String, enum: ["resting", "loading", "on-mission"], default: "resting"},
    loadedItems: [{type: Schema.Types.ObjectId, ref: "Item"}]
}, {timestamps: true})

export const Mover = model<MoverInterface>('Mover', MoverSchema)

