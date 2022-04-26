import { ADMIN } from "../../models/index.js";
import { hashPassword } from "../index.js";

export const findAdminByEmail = async (req) => {
	return ADMIN.findOne({
		where: {
			email:req.body.email
		}
	});
}

export const addAdmin = async(req)=>{
  return await ADMIN.create({
     email:req.body.email,
     name:req.body.name,
     password: await hashPassword(req.body.password),
    //  otp:otp,
    //  isVerified:false,
  })
}



export const updatePassword = async(req,id)=>{
    const newPassword = await ADMIN.update(
    { password:await hashPassword(req.body.newPassword)},
    { where: { id: id } },
  )
  return newPassword;
}

export const updateVerification = async(req)=>{
  const adminverification = await ADMIN.update(
    { isVerified: true},
    { where: { email: req.body.email } },
  )
  return adminverification;
}

export const updateOtp = async(email,otp)=>{
  const setOtp = await ADMIN.update(
    { otp: otp},
    { where: { email: email } },
  )
  return setOtp;
}

export const updateResetPassword = async(req)=>{
  const newPassword = await ADMIN.update(
  { password:await hashPassword(req.body.newPassword)},
  { where: {email: req.body.email } },
)
return newPassword;
}


export const checkEmailExist = async (email) => {
	return await ADMIN.findOne({
		where: {
			email:email
		}
	});
}

export const addNewAdmin = async(email,name)=>{
  return await ADMIN.create({
     email:email,
     name:name,
     isVerified:true,
  })
}