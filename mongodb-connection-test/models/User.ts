import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Define an interface representing a document in MongoDB
export interface IUser extends Document {
  _id: Types.ObjectId;
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
  coins: number;
  tickets: number;
  boosts: {
    boost1: number;
    boost2: number;
    boost3: number;
    boost4: number;
  };
  createdAt: Date;
}


// Define the Mongoose schema for the User model
const UserSchema: Schema<IUser> = new Schema<IUser>({
  telegramId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  username: String,
  coins: {
    type: Number,
    default: 0,
  },
  tickets: {
    type: Number,
    default: 0,
  },
  boosts: {
    boost1: { type: Number, default: 0 },
    boost2: { type: Number, default: 0 },
    boost3: { type: Number, default: 0 },
    boost4: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Export the User model if it's not already created
const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserModel;
