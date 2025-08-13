import { model, Schema } from "mongoose"

export interface ItemInterface extends Document
{
    name: string;
    weight: number;
    createdAt: Date;
    updatedAt: Date;
}

const ItemSchema = new Schema<ItemInterface>({
    name: { type: String, required: true, trim: true },
    weight: { type: Number, required: true, min: 0 }
}, { timestamps: true })

export const Item = model<ItemInterface>("Item", ItemSchema);