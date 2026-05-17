import mongoose, { Schema, model, Model } from "mongoose";

export interface ICart {
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true, // one cart per user
      required: true,
    },
    
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
}

const cartSchema = new Schema<ICart>({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true, // one cart per user
      required: true,
    },
    
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],

}, { timestamps: true });

const cartModel = model<ICart>("Cart", cartSchema);

export default cartModel;
