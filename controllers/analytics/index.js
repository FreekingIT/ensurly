import express from "express";
const { Router } = express;
import moment from "moment";

import {
  catchAsyncAction,
  makeResponse,
  responseMessages,
  statusCodes,
} from "../../helpers/index.js";
import {
  countSkU,
  getSkU,
} from "../../services/index.js";
const {
  SKUFetch,
} = responseMessages;
//Response Status code
const { SUCCESS, NOT_FOUND, BAD_REQUEST, RECORD_ALREADY_EXISTS } = statusCodes;
import adminAuth from "../../middleware/auth/admin.js";
const router = Router();



router.get('/count',adminAuth,catchAsyncAction(async(req,res)=>{
    const startOfDay   = moment().startOf("day");
    const endOfDay     = moment().endOf("day");
    const startOfMonth = moment().startOf("month");
    const endOfMonth   = moment().endOf("month");
    const startOfWeek  = moment().startOf('week');
    const endOfWeek    = moment().endOf('week');

    const month =  await countSkU(startOfMonth,endOfMonth);
    const week  =  await countSkU(startOfWeek,endOfWeek);
    const today =  await countSkU(startOfDay,endOfDay);
    const data = {
        Monthly : `In this Month ${month} Record has been added`,
        Week    : `In this Week  ${week}  Record has been added`,
        Today   : `In this Today ${today} Record has been added`,
    }
    return makeResponse(res, SUCCESS, true,SKUFetch, data);
}))

router.get('/data',adminAuth,catchAsyncAction(async(req,res)=>{
    const startOfDay   = moment().startOf("day");
    const endOfDay     = moment().endOf("day");
    const startOfMonth = moment().startOf("month");
    const endOfMonth   = moment().endOf("month");
    const startOfWeek  = moment().startOf('week');
    const endOfWeek    = moment().endOf('week');

    const month =  await getSkU(startOfMonth,endOfMonth);
    const week  =  await getSkU(startOfWeek,endOfWeek);
    const today =  await getSkU(startOfDay,endOfDay);
    const data = {
        Monthly : month,
        Week    : week,
        Today   : today,
    }
    return makeResponse(res, SUCCESS, true,SKUFetch, data);
}))


export const analytics = router;
