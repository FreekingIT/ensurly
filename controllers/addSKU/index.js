import express from "express";
const { Router } = express;
import {
  catchAsyncAction,
  makeResponse,
  responseMessages,
  statusCodes,
} from "../../helpers/index.js";
import { validators } from "../../middleware/index.js";
import { privateKey } from "../../config/privateKeys.js";
import {
  deleteSKU,
  getSKU,
  createSKU,
  addQR,
  getAll,
  generateQR,
  convertBase64ToImg,
  getPagination,
  getPagingData,
  upload,
  updateSKU,
} from "../../services/index.js";
const {
  SKUAdded,
  DeleteSKU,
  SKUDetail,
  ID_NOT_EXIST,
  SKUUpdate,
 
} = responseMessages;
//Response Status code
const { SUCCESS, NOT_FOUND, BAD_REQUEST, RECORD_ALREADY_EXISTS } = statusCodes;
import adminAuth from "../../middleware/auth/admin.js";
import fs from "fs";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);
const router = Router();


// Add SKU
router.post(
  "/",
  adminAuth,
  upload.single("productImage"),
  catchAsyncAction(async (req, res) => {
    const adminID = req.adminData.id;
    const path = req.file.path;
    const data = await createSKU(req, adminID, path);
    //Converting into string
    let skuId = data.id.toString();
    let generateQRCode = await generateQR('ID:' + skuId);
    //Convert base64 image to .png image
    let convertedImg = await convertBase64ToImg(generateQRCode);
    await addQR(convertedImg,data.id);
    return makeResponse(res, SUCCESS, true, SKUAdded, {data,qrCode:convertedImg});
  }) 
);

// get SKU By ID
router.get(
  "/id/:id",
  adminAuth,
  catchAsyncAction(async (req, res) => {
  console.log("2");

    const id = req.params.id;
    const data = await getSKU(id);
    if (data) {
      return makeResponse(res, SUCCESS, true, SKUDetail, data);
    }
    if (!data) {
      return makeResponse(res, BAD_REQUEST, false, ID_NOT_EXIST);
    }
  })
);

// Get All SKU

router.get('/',adminAuth,catchAsyncAction(async(req,res)=>{
  const { page, size } = req.query;
  const { limit, offset } = await getPagination(page, size);
  const data = await getAll( limit, offset);
  const response = await getPagingData(data, page, limit);
  return makeResponse(res, SUCCESS, true, SKUDetail, response);
}))

// Delete SKU
router.delete(
  "/:id",
  adminAuth,
  catchAsyncAction(async (req, res) => {
    const skuID = req.params.id;
    console.log(skuID);
    const data = await getSKU(skuID);
    if (data) {
      await deleteSKU(skuID);
      await unlinkAsync(data.productImage);
      return makeResponse(res, SUCCESS, true, DeleteSKU, data);
    }
    if (!data) {
      return makeResponse(res, BAD_REQUEST, false, ID_NOT_EXIST);
    }
  })
);

// update sku

router.patch(
  "/:id",
  adminAuth,
  upload.single("productImage"),
  catchAsyncAction(async (req, res) => {
    const id = req.params.id;
    let path;
    const data = await getSKU(id);
    if (data) {
      if (req.file) {
        path = req.file.path;
        console.log(path);
        const updateData = await updateSKU(req, id, path);
        await unlinkAsync(data.productImage);
        return makeResponse(res, SUCCESS, true, SKUUpdate, updateData);
      }
      if (!req.file) {
        path = req.body.productImage;
        const updateData = await updateSKU(req, id, path);
        return makeResponse(res, SUCCESS, true, SKUUpdate, updateData);
      }
    }
    if (!data) {
      return makeResponse(res, BAD_REQUEST, false, ID_NOT_EXIST);
    }
  })
);

export const addSKU = router;