import { Schema, model, Document, Types } from 'mongoose';

export type ActivityType = 'loading' | 'start-mission' | 'end-mission';

export interface ActivityLogInterface extends Document {
  mover: Types.ObjectId;
  type: ActivityType;
  itemsSnapshot: Types.ObjectId[];
  createdAt: Date;
}

const ActivityLogSchema = new Schema<ActivityLogInterface>({
  mover: { type: Schema.Types.ObjectId, ref: 'Mover', required: true, index: true },
  type: { type: String, enum: ['loading','start-mission','end-mission'], required: true, index: true },
  itemsSnapshot: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
}, { timestamps: { createdAt: true, updatedAt: false } });

export const ActivityLog = model<ActivityLogInterface>('ActivityLog', ActivityLogSchema);
