import mongoose, { Schema, model, Model } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  color: string;
  price: number;
  images: [string];
  stock: number;
  avgRating: number;
  totalRatings: number;
  brand: string;
  category: String;
  isDeleted: boolean
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: [true, "please enter name"], trim: true, },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: [true, "please enter description"] },
  color: { type: String, required: [true, "please enter color"], },
  price: { type: Number, required: [true, "please enter price"], },
  images: [{      url: String,      public_id: String    }  ],
  stock: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  brand: { type: String, required: [true, "please enter brand"], },
  category: { type: String, required: [true, "please enter category"], },
  isDeleted: { type: Boolean , default: false},

}, { timestamps: true });

const productModel = model<IProduct>("Product", productSchema);

export default productModel;
