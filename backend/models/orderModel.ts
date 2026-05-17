import mongoose, { Schema, model, Model, ObjectId } from "mongoose";

export interface IOrder {
    userId: ObjectId;
    userSnapshot: {
        name: String,
        email: String,
        phone: String,
    },
    items: {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        productSnapshot: {
            name: String,
            price: Number,
            images: [String],
        },
        quantity: { type: Number, required: true },
        totalprice: { type: Number, required: true }, // snapshot price
    }[],
    totalAmount: { type: Number, required: true },
    currency: string,
    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    paymentId: string,
    isPaymentVerfied: boolean
}

const orderSchema = new Schema<IOrder>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userSnapshot: {
        name: String,
        email: String,
        phone: String,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            productSnapshot: {
                name: String,
                price: Number,
                images: [String],
            },
            quantity: { type: Number, required: true },
            totalprice: { type: Number, required: true }, // snapshot price
        },
    ],
    totalAmount: { type: Number, required: true },
    currency: String,
    status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending", },
    paymentId: { type: String, required: true },
    isPaymentVerfied: { type: Boolean, required: true }
}, { timestamps: true });

const orderModel = model<IOrder>("Order", orderSchema);

export default orderModel;
