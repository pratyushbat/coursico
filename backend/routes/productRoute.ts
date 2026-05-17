import { Router } from "express";
import { allProductsList, createProduct, productById } from "../controllers/productController";
import { isJwtAuthTokenExit } from "backend/middleware/isJwtAutTokenExit";
// import { isJwtAuthTokenExit } from "../middleware/isJwtAutTokenExit";
// import upload from "../middleware/upload";
const route: Router = Router();

route.get("/all",  allProductsList);
route.get("/productId/:id", isJwtAuthTokenExit, productById);

// route.post("/create", isJwtAuth  TokenExit, upload.array('images', 6), createProduct);

export default route;
