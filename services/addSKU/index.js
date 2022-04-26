import multer from 'multer';
import path from 'path';
import { SKUS } from '../../models/index.js';
import QRCode from 'qrcode'
import base64ToImage from 'base64-to-image';

//Genrate QR code
export const generateQR = async text => {
    return await QRCode.toDataURL(text);
}

/*NOTE: function for convert base64 to png image*/

export const convertBase64ToImg = async(generateQR)=>{
	try {
		let base64Str = generateQR;
		let path = './public/qrcodes/';
		let optionalObj = { 'type': 'png' };
		let imageInfo = base64ToImage(base64Str, path, optionalObj);
		let barcodeImage = (path.substring(1) + imageInfo.fileName)
		return barcodeImage;
	} catch (error) {
		console.log(error);
		return error;
	}
}

// ADD QR in table
export const addQR = async(convertedImg,id)=>{
  return await SKUS.update(
    {qrCode : convertedImg},
    { where: { id: id } }
  )}

export const createSKU = async(req,id,path)=>{
    return await SKUS.create({
       admin_id:id, 
       productName:req.body.productName,
       manufacturingDate:req.body.manufacturingDate,
       skuID: req.body.skuID ? req.body.skuID : null,
       expiry:req.body.expiry,
       companyName:req.body.companyName,
       specialInstruction:req.body.specialInstruction ? req.body.specialInstruction : null,
       productImage:path,
       batchNumber:req.body.batchNumber,
       weight:req.body.weight ? req.body.weight : null,
       mrp:req.body.mrp,
       manufacturedBy : req.body.manufacturedBy ? req.body.manufacturedBy : null,
       flashMessage: req.body.flashMessage ? req.body.flashMessage : null
    })
  }

export const deleteSKU = async(id)=>{
  return await SKUS.destroy({
    where: {
        id:id
    }
})
}

export const getSKU = async(id)=>{
  return await SKUS.findOne({
    where: {
        id:id
    }
})
}
// Tutorial.findAndCountAll({ where:  limit, offset })
export const getAll = async( limit, offset)=>{
  return await SKUS.findAndCountAll({limit:limit, offset:offset});
}

export const updateSKU = async(req,id,path)=>{
  return await SKUS.update(
    {
       productName:req.body.productName,
       manufacturingDate:req.body.manufacturingDate,
       skuID: req.body.skuID,
       expiry:req.body.expiry,
       companyName:req.body.companyName,
       specialInstruction:req.body.specialInstruction,
       productImage:path,
       batchNumber:req.body.batchNumber,
       weight:req.body.weight,
       mrp:req.body.mrp,
       manufacturedBy : req.body.manufacturedBy,
       flashMessage: req.body.flashMessage
      },
    { where: { id: id } }
  )
}

// Pagination

export const getPagination = async(page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

export const getPagingData = async(data, page, limit) => {
  const { count: totalItems, rows: tutorials } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, tutorials, totalPages, currentPage };
};

const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: "public/productImage",
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname +
          "_" +
          new Date().toISOString().replace(/:/g, "-") +
          path.extname(file.originalname)
      );
    },
  });
  
  const upload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error("File must be image type"));
      }
      cb(undefined, true);
    },
  });

  export {upload}