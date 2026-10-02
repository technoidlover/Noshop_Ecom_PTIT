import mongoose, { Document, Schema } from 'mongoose';

export interface IShop {
  name: string;
  description?: string;
  phone?: string;
  address?: string;
  logo?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'seller' | 'buyer';
  phone?: string;
  address?: string;
  shop?: IShop;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShopSchema = new Schema<IShop>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  logo: { type: String, default: '' }
}, { _id: false });

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'seller', 'buyer'], default: 'buyer' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  shop: { type: ShopSchema, required: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);
