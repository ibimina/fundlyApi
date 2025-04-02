import { ObjectId, Schema } from 'mongoose';

export const AccountSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  uniqueId: { type: String, required: true, unique: true },
  transactions: [],
  subscriptions: [],
  authorizations: [],
  passcode: String,
  username: String,
  domain: String,
  customerCode: String,
  riskAction: String,
  id: Number,
  metadata: { id: String },
  integration: Number,
  identified: Boolean,
  identifications: [],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export interface Account extends Document {
  firstName: string;
  lastName: string;
  password: string;
  uniqueId: string;
  username: string;
  email: string;
  passcode: string;
  transactions: string[];
  subscriptions: string[];
  authorizations: string[];
  metadata: { id: string };
  domain: string;
  customerCode: string;
  riskAction: string;
  id: number;
  integration: number;
  identified: boolean;
  identifications: string[];
  createAt: Date;
  updateAt: Date;
  _id: ObjectId;
}
