import express from "express";
import formidable from 'express-formidable'
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/ProductController.js";
const router = express.Router();

// Routes
router.post("/create-product", requireSignIn, isAdmin,formidable(), createProductController);

router.put("/update-product/:pid", requireSignIn, isAdmin,formidable(), updateProductController);

router.get("/get-product", getProductController);


router.get('/single-product/:slug',getSingleProductController)

router.get('/product-photo/:pid',productPhotoController)

router.get('/product-count',productCountController)


router.get('/product-list/:page',productListController)


router.get('/search/:keyword',searchProductController)


router.get('/related-product/:pid/:cid',relatedProductController)


router.get('/product-category/:slug',productCategoryController)

//payment route
//token
router.get('/braintree/token',braintreeTokenController)

//payments
router.post('/braintree/payment',requireSignIn,braintreePaymentController)



router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProductController);
export default router;
