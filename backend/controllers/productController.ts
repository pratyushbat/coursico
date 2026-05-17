import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from "express";
import { sendError } from "../utils/sendError";

import {  v2 } from 'cloudinary';
import productModel from "../models/productsModel";
import mongoose from "mongoose";
const slugify = require('slugify');

export const allProductsList: RequestHandler = async (req: Request, res: Response) => {
  try {
    const products = await productModel.find().sort('-createdAt');
        console.log('asdas', products)
   return  res.json(products);

  } catch (error: any) {
  return  sendError(res, 400, "Failed To Login 🙄", error?.message);
  }
};

export const productById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('id',id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product id'
      });
    }
     const product = await productModel.findById(id);
     console.log(product,'product')
      if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

 return   res.status(200).json({
      success: true,
      data: product
    });

  } catch (error: any) {
   return sendError(res, 400, "Failed To Login 🙄", error?.message);
  }
};


export const createProduct: RequestHandler = async (
  req: Request | any,
  res: Response
) => {
  try {
        console.log('req.body prodycsts', req.body)
    const { name, description, color, price, stock, avgRating, totalRatings, brand, category } = req.body;
    const files = req.files as any[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Images required' });
    }
   
    let cloudResult = null;
    const uploads = await Promise.all(
      files.map(file => uploadToCloudinary(file.buffer))
    );
    
    if (uploads) {
      const newProduct = await productModel.create({
        name,
        slug: slugify(name, { lower: true }),
        description,
        color,
        price: Number(price),
        images: uploads.map((img: any) => ({
          url: img.secure_url,
          public_id: img.public_id
        })),
        stock,
        avgRating: Number(avgRating),
        totalRatings: Number(totalRatings),
        brand,
        category
      });
      return res.status(200).json({
        success: true,
        product: newProduct,
      });
    }
    else {
      return res.status(300).json({
        success: false,
        error: 'cloudinarty error',
      });
    }


  }
  catch (error: any) {

  return  sendError(res, 400, "Failed to create Products otp", error);
  }
};




const uploadToCloudinary = (buffer: any) => {
  return new Promise((resolve, reject) => {
    v2.uploader.upload_stream(
      {
        folder: 'products',
        resource_type: 'image'
      },
      (error: any, result: any) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};
