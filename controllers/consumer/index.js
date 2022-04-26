import express from "express";
const { Router } = express;
import moment from "moment";
import { validators } from '../../middleware/index.js';

import {
  catchAsyncAction,
  makeResponse,
  responseMessages,
  statusCodes,
} from "../../helpers/index.js";
import { privateKey } from '../../config/privateKeys.js';
import {
  countSkU,
  getSkU,
  sendEmail,
  AppWaiters,
  findEarlyAccesser
} from "../../services/index.js";
const {
  SKUFetch,
  ALREADY_REGISTER,
  REGISTERD
} = responseMessages;
//Response Status code
const { SUCCESS, NOT_FOUND, BAD_REQUEST, RECORD_ALREADY_EXISTS } = statusCodes;
import adminAuth from "../../middleware/auth/admin.js";
import { EARLYACCESS } from "../../models/index.js";
const router = Router();


// router.get('/',catchAsyncAction(async(req,res)=>{
//   return res.redirect('/v1/admin/homepage')
// }))

router.post('/',validators('EARLYACCESS'),catchAsyncAction(async(req,res)=>{
  const checkEmail = await findEarlyAccesser(req.body.email);
  if(checkEmail){

    return res.render('homePage',{ALREADY_REGISTER})
    // return makeResponse(res,BAD_REQUEST,false, ALREADY_REGISTER);
  }if(!checkEmail){
  const saveEmail = await AppWaiters(req.body.email); 
  await sendEmail({
    from: privateKey.EMAIL,
    to: req.body.email,
    subject: 'EarlyAccess for Ensurely App',
    text: `Thankyou for showing interest in Ensurely App.You will get email once we launched App`
})
    // return makeResponse(res, SUCCESS, true, REGISTERD,saveEmail);
    return res.render('homePage',{REGISTERD})

  }
  }))


export const consumer = router;