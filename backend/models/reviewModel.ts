import mongoose, { Schema, model, Model, ObjectId } from "mongoose";

export interface IReview {
    product: ObjectId;
    user: ObjectId;
    rating: number;
    comment: string;
}

const reviewSchema = new Schema<IReview>({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', }, // optional  
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String
}, { timestamps: true });

const reviewModel = model<IReview>("Review", reviewSchema);

export default reviewModel;
