import mongoose, { Schema, model, Model, Types, Document } from "mongoose";

export interface IAddress {
   _id: Types.ObjectId;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: object;
  pincode: string;
  country: String;
  isDefault: boolean;
}
const addressSchema = new mongoose.Schema<IAddress>(
  {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

export interface IUser extends Document{
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userLocationData: object;
  profilePic: string;
  role: String;
  addresses: Types.DocumentArray<IAddress>
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, "please enter firstName"],
    trim: true,
  },
  lastName: { type: String, required: [true, "please enter lastName"] },
  phoneNumber: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "please enter phone number"],
  },
  profilePic: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "please enter email"],
  },
  password: {
    type: String,
    required: [true, "please enter password"],
  },
  role: {
    type: String,
    required: [true, "please enter role"],
  },
  userLocationData: { type: Object },
  addresses: [addressSchema],
});



const userModel = model<IUser>("otpUser", userSchema);

export default userModel;
