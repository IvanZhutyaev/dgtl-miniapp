import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IBoostCard extends Document {
  _id: Types.ObjectId; 
  title: string; 
  price: number; 
  imageUrl: string; 
  description: string; 
  availability: boolean; 
  id: string; 
}


const BoostCardSchema: Schema<IBoostCard> = new Schema<IBoostCard>({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
    default: true, // Set default availability to true
  },
  id: {
    type: String,
    required: true,
    unique: true, // Ensure the `id` field is unique
    index: true,
  },
  },
{
  collection: "boosts-cards", // Explicitly specify the collection name
},);

// Export the BoostCard model if it's not already created
const BoostCardModel: Model<IBoostCard> = mongoose.models.BoostCard || mongoose.model<IBoostCard>('BoostCard', BoostCardSchema);
export default BoostCardModel;
