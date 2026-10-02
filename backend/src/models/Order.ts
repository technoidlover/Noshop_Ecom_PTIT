import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seller: mongoose.Types.ObjectId;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city?: string;
  note?: string;
}

export interface IOrder extends Document {
  orderCode: string;
  buyer: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'COD' | 'BANK_TRANSFER';
  paymentStatus: 'UNPAID' | 'PAID';
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { _id: false });

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, default: '' },
  note: { type: String, default: '' }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  orderCode: { type: String, required: true, unique: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  shippingAddress: { type: ShippingAddressSchema, required: true },
  paymentMethod: { type: String, enum: ['COD', 'BANK_TRANSFER'], default: 'COD' },
  paymentStatus: { type: String, enum: ['UNPAID', 'PAID'], default: 'UNPAID' },
  orderStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  totalAmount: { type: Number, required: true }
}, {
  timestamps: true
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
