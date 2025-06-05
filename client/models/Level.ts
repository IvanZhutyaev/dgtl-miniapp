import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ILevel extends Document {
  name: string;           
  badges: string[];      
  backgroundUrl: string;     
  menuImageUrl?: string;
  order: number;  
  availability: boolean;      
}

const LevelSchema = new Schema<ILevel>({
  name: { type: String, required: true },
  badges: { type: [String], default: [] },
  backgroundUrl: { type: String, default: "" },
  order: { type: Number, required: true, unique: true },
  availability: { type: Boolean, required: true },
 
},
{
  collection: "leveldata", // Explicitly specify the collection name
},);

const Level: Model<ILevel> = mongoose.models.Level || mongoose.model<ILevel>('Level', LevelSchema);

export default Level;
