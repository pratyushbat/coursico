
import {
    Request,
    Response,
    RequestHandler,
    NextFunction,
    Router
} from "express";
import { allProductsList, createProduct, productById } from "../controllers/productController";
import { isJwtAuthTokenExit } from "backend/middleware/isJwtAutTokenExit";
import { of } from "rxjs";
import productModel from "backend/models/productsModel";
import { sendError } from "backend/utils/sendError";
// import { isJwtAuthTokenExit } from "../middleware/isJwtAutTokenExit";
// import upload from "../middleware/upload";
export const allProductsLisat: RequestHandler = async (req: Request, res: Response) => {
  try {
    const products = await productModel.find().sort('-createdAt');
        console.log('asdas', products);
        res.set({
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0'
});
   return  res.json(products);

  } catch (error: any) {
  return  sendError(res, 400, "Failed To Login 🙄", error?.message);
  }
};

const route: Router = Router();

route.get("/dull", allProductsLisat);
route.get("/all", allProductsLisat);

route.get("/productId/:id", isJwtAuthTokenExit, productById);


// route.post("/create", isJwtAuth  TokenExit, upload.array('images', 6), createProduct);

export default route;
