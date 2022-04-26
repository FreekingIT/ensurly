import express from 'express';
const { Router } = express;
import { catchAsyncAction, makeResponse, responseMessages, statusCodes, userMapper, token } from '../../helpers/index.js';
import { validators } from '../../middleware/index.js';
import { privateKey } from '../../config/privateKeys.js';
import { findAdminByEmail,addNewAdmin,checkEmailExist,updateVerification,addAdmin,assignToken,matchPassword,updatePassword,generateOtp,updateOtp,sendEmail,updateResetPassword } from '../../services/index.js';
const { LOGIN, OTP_MISMATCH, INVALID_PASSWORD, INVALID, PASSWORD_CHANGED, ADMIN_ADDED, USER_NOTFOUND, RESET_PASSWORD, OTP_FOR_PASSWORD,OTP_FOR_EMAIL_VERIFICATION, VERIFY_OTP, EMAIL_NOT_REGISTER, ALREADY_EXIST,REGISTERD,PASSWORD_NOT_MATCH,INVALID_EMAIL,INCORRECT_PASSWORD,EMAIL_OTP_NOT_VERIFIED } = responseMessages;
//Response Status code
const { SUCCESS, NOT_FOUND, BAD_REQUEST, RECORD_ALREADY_EXISTS, } = statusCodes;
import adminAuth from '../../middleware/auth/admin.js';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ADMIN } from "../../models/index.js";
import { LocalStorage } from "node-localstorage";

const localStorage = new LocalStorage('./scratch');
const router = Router();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// signup with google

passport.use(
  new GoogleStrategy(
    {
      clientID:privateKey.clientID,
      clientSecret: privateKey.clientSecret,
      callbackURL: "/v1/admin/redirect/auth/google",
    },async (accessToken, refreshToken, profile,cb)=>{
      let emailExist = await checkEmailExist(profile.emails[0].value)
      if(!emailExist) await addNewAdmin(profile.emails[0].value,profile.displayName)
      return cb(null,true);
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/redirect/auth/google",
  passport.authenticate("google", {
    successRedirect: "/v1/admin/google/signin",
    // failureRedirect: "/v1/admin/google/signin",
  })
);

router.get('/google/signin',catchAsyncAction(async(req,res)=>{
  return res.redirect('dashboard');
}))
// signup with google end ******************************



// signup and send otp over email for verification

// router.get('/sign-up',catchAsyncAction(async(req,res)=>{
//  req.session.currentPath = req.protocol + '://' + req.get('host') + req.originalUrl;
//   if(req.session.accessToken){
//     res.redirect('/v1/admin/dashboard')
//   }else{
//   res.render('auth-signup');
//   }
// }))

router.post('/sign-up',validators('SIGNUP'),catchAsyncAction(async(req,res)=>{
  const otp = generateOtp();
    let adminRecord = await findAdminByEmail(req);
    if (adminRecord){
     if(adminRecord.isVerified === true){
    //  return makeResponse(res, RECORD_ALREADY_EXISTS, false, ALREADY_EXIST)
      return res.render('auth-signup',{ALREADY_EXIST});

    }else{
    //  return makeResponse(res, BAD_REQUEST,false, EMAIL_OTP_NOT_VERIFIED)
     await sendEmail({
      from: privateKey.EMAIL,
      to: req.body.email,
      subject: 'OTP for Email Verification',
      text: `The OTP for verification of your email ${otp}`
     })
      await updateOtp(req.body.email,otp);
       return res.render('auth-otp-verification',{EMAIL_OTP_NOT_VERIFIED});
    }
  }
    if(req.body.password === req.body.confirmPassword){
        await sendEmail({
        from: privateKey.EMAIL,
        to: req.body.email,
        subject: 'OTP for Email Verification',
        text: `The OTP for verification of your email ${otp}`
    })
        await addAdmin(req,otp);
        // return makeResponse(res, SUCCESS, true, OTP_FOR_EMAIL_VERIFICATION);
      res.cookie('OTP_FOR_EMAIL_VERIFICATION',OTP_FOR_EMAIL_VERIFICATION, { maxAge: 15000 });
      return res.redirect('/v1/admin/sign-up/otp/verfication')
    }
    if(req.body.password !== req.body.confirmPassword){
        // return makeResponse(res, BAD_REQUEST, false, PASSWORD_NOT_MATCH);
        let email = req.body.email;
        return res.render('auth-signup',{PASSWORD_NOT_MATCH,email});
      }
}))

// homepage signup
router.get('/homePage',catchAsyncAction(async(req,res)=>{
  req.session.currentPath = req.protocol + '://' + req.get('host') + req.originalUrl;
   if(req.session.accessToken){
     res.redirect('/v1/admin/dashboard')
   }else{
   res.render('homePage');
   }
 }))
 
 router.post('/sign-up/homePage',validators('SIGNUP'),catchAsyncAction(async(req,res)=>{
   console.log("enter");
   const otp = generateOtp();
     let adminRecord = await findAdminByEmail(req);
     if (adminRecord){
      // if(adminRecord.isVerified === true){
     //  return makeResponse(res, RECORD_ALREADY_EXISTS, false, ALREADY_EXIST)
       return res.render('homePage',{ALREADY_EXIST});
 
    //  }else{
    //  //  return makeResponse(res, BAD_REQUEST,false, EMAIL_OTP_NOT_VERIFIED)
    //   await sendEmail({
    //    from: privateKey.EMAIL,
    //    to: req.body.email,
    //    subject: 'OTP for Email Verification',
    //    text: `The OTP for verification of your email ${otp}`
    //   })
    //    await updateOtp(req.body.email,otp);
    //     return res.render('auth-otp-verification',{EMAIL_OTP_NOT_VERIFIED});
    //  }
   }
     if(req.body.password === req.body.confirmPassword){
    //      await sendEmail({
    //      from: privateKey.EMAIL,
    //      to: req.body.email,
    //      subject: 'OTP for Email Verification',
    //      text: `The OTP for verification of your email ${otp}`
    //  })
         await addAdmin(req);
    //      // return makeResponse(res, SUCCESS, true, OTP_FOR_EMAIL_VERIFICATION);
    //    res.cookie('OTP_FOR_EMAIL_VERIFICATION',OTP_FOR_EMAIL_VERIFICATION, { maxAge: 15000 });
    //    return res.redirect('/v1/admin/sign-up/otp/verfication')
          // return res.render('homePage',{isAdded:true})
          // res.status(201).render('homePage', { isAdded : true } );
          var success="You Signup Successfully"
          return res.render('homePage',{success})
        }
     if(req.body.password !== req.body.confirmPassword){
         // return makeResponse(res, BAD_REQUEST, false, PASSWORD_NOT_MATCH);
         let email = req.body.email;
         return res.render('homePage',{PASSWORD_NOT_MATCH,email});
       }
 }))

// signup otp verification

// router.get('/sign-up/otp/verfication',catchAsyncAction(async(req,res)=>{
//  req.session.currentPath = req.protocol + '://' + req.get('host') + req.originalUrl;
//   if(req.session.accessToken){
//     res.redirect('/v1/admin/dashboard');
//   }else{
//     res.render("auth-otp-verification",{OTP_FOR_EMAIL_VERIFICATION:req.cookies.OTP_FOR_EMAIL_VERIFICATION})
//   }
// }))


router.post('/sign-up/otp/verfication',validators('VERIFY-OTP'),catchAsyncAction(async(req,res)=>{
  const admin = await findAdminByEmail(req)
  if(admin.otp === parseInt(req.body.otp)){
    await updateVerification(req);
    let authToken = await token({ id: admin.id, email: admin.email, role: 'admin' });
    let { accessToken, refreshToken } = authToken;
			// return makeResponse(res, SUCCESS, true, LOGIN,
				// { accessToken, refreshToken, role: 'admin' });
        req.session.accessToken = accessToken;
        return res.redirect('/v1/admin/dashboard');

      }else{
    // return makeResponse(res, BAD_REQUEST, false, OTP_MISMATCH);
    return res.render('auth-otp-verification',{OTP_MISMATCH});

    }
}))

// login

router.get('/login',catchAsyncAction(async(req,res)=>{
 req.session.currentPath = req.protocol + '://' + req.get('host') + req.originalUrl;
  if(req.session.accessToken){
    res.redirect('/v1/admin/dashboard')
  }else{
  res.render('auth-signin',{RESET_PASSWORD:req.cookies.RESET_PASSWORD});
  }
}))

router.post('/login',validators('LOGIN'),catchAsyncAction(async(req,res)=>{
  const otp = generateOtp();
  let admin = await findAdminByEmail(req);
  // if (!admin) return makeResponse(res, NOT_FOUND, false, INVALID_EMAIL);
  // if (!admin) return res.render('auth-signup',{INVALID_EMAIL});
   if (!admin) return res.render('auth-signin',{INVALID_EMAIL});

  if (admin.isVerified !== true){
  // return makeResponse(res, BAD_REQUEST,false, EMAIL_OTP_NOT_VERIFIED);
  await sendEmail({
    from: privateKey.EMAIL,
    to: req.body.email,
    subject: 'OTP for Email Verification',
    text: `The OTP for verification of your email ${otp}`
   })
    await updateOtp(req.body.email,otp);
     return res.render('auth-otp-verification',{EMAIL_OTP_NOT_VERIFIED});
  }
  const passwordCorrect = await matchPassword(req.body.password, admin.password);
			if (!passwordCorrect) {
				// return makeResponse(res, BAD_REQUEST, false, INCORRECT_PASSWORD);
        return res.render('auth-signin',{INCORRECT_PASSWORD});
			}
      let authToken = await token({ id: admin.id, email: admin.email, role: 'admin' });
      let { accessToken, refreshToken } = authToken;

			// makeResponse(res, SUCCESS, true, LOGIN,
			// 	{ accessToken, refreshToken, role: 'admin' });
       req.session.accessToken = accessToken;
       return res.redirect('/v1/admin/dashboard');

}))  


router.get('/dashboard',catchAsyncAction(async(req,res)=>{
 req.session.currentPath = req.protocol + '://' + req.get('host') + req.originalUrl;
   if(req.session.accessToken){
   res.render('dashboard/index');
   }else{
     res.redirect('/v1/admin/homepage')
   }
}))

// refresh-token

router.get('/refresh-token', adminAuth,catchAsyncAction(async(req, res) => {
  let authToken = await token({ id: req.adminData.id, email: req.adminData.email, role: 'admin' });
  let { accessToken, refreshToken } = authToken;
	return makeResponse(res, SUCCESS, true, '', { accessToken, refreshToken, role: 'admin' });
}));

// change password

router.post('/change/password',adminAuth,validators('CHANGE_PASSWORD'),catchAsyncAction(async(req,res)=>{
  const passwordCorrect = await matchPassword(req.body.oldPassword, req.adminData.password);
  if (!passwordCorrect) {
    return makeResponse(res, BAD_REQUEST, false, INCORRECT_PASSWORD);
  }
  if(req.body.newPassword === req.body.confirmPassword){
    await updatePassword(req,req.adminData.id);
    return makeResponse(res, SUCCESS, true, PASSWORD_CHANGED);
  }
  if(req.body.newPassword !== req.body.confirmPassword){
      return makeResponse(res, BAD_REQUEST, false, PASSWORD_NOT_MATCH);
    }
}))


// forgot password

router.get('/forgot/password',catchAsyncAction(async(req,res)=>{
 req.session.currentPath = req.protocol + '://' + req.get('host') + req.originalUrl;
  if(req.session.accessToken){
    res.redirect('/v1/admin/dashboard')
  }else{
  res.render('auth-reset-password');
  } 
}))


router.post('/forgot/password',validators('FORGOT_PASSWORD'),catchAsyncAction(async(req,res)=>{
  const otp = generateOtp();
  findAdminByEmail(req)
      .then(admin => {
          // if (!admin) throw new Error(INVALID_EMAIL);
          if (!admin) throw res.render('auth-signup',{INVALID_EMAIL});
          // if (!admin) throw res.redirect('auth-signup');

          if (admin.isVerified !== true) return makeResponse(res, BAD_REQUEST,false, EMAIL_OTP_NOT_VERIFIED);
          return Promise.all(
              [
                sendEmail({
                  from: privateKey.EMAIL,
                  to: req.body.email,
                  subject: 'OTP for password reset',
                  text: `The OTP for resetting your password is ${otp}`
              }),
                  updateOtp(req.body.email, otp)
              ]
          )
      })
      .then(async result => {
          delete result[1]?._doc?.password;
          // return makeResponse(res, SUCCESS, true, OTP_FOR_PASSWORD);
          return res.render('auth-forgot-otpVerification',{OTP_FOR_PASSWORD});
      })
      .catch(async error => {
          return makeResponse(res, BAD_REQUEST, false, error.message);
      });
}))


// verify otp for reset password
router.get('/verify-otp',catchAsyncAction(async(req,res)=>{
 req.session.currentPath = req.protocol + '://' + req.get('host') + req.originalUrl;
  if(req.session.accessToken){
    res.redirect('/v1/admin/dashboard')
 }else{
   res.redirect('/v1/admin/login')
 }
}))

router.post('/verify-otp',validators('VERIFY-OTP'),catchAsyncAction(async(req,res)=>{
  if(req.session.accessToken){
     res.redirect('/v1/admin/dashboard')
  }else{
  const verifyOTP = await findAdminByEmail(req)
  if(verifyOTP.otp === parseInt(req.body.otp)){
    // return makeResponse(res, SUCCESS, true, VERIFY_OTP);
    return res.render('auth-set-password',{VERIFY_OTP})
    }else{
    // return makeResponse(res, BAD_REQUEST, false, OTP_MISMATCH);
    return res.render('auth-forgot-otpVerification',{OTP_MISMATCH});
    }
  }
}))

// reset password

router.post('/reset/password',validators('RESET_PASSWORD'),catchAsyncAction(async(req,res)=>{
  if(req.body.newPassword === req.body.confirmPassword){
    await updateResetPassword(req);
    // return makeResponse(res, SUCCESS, true, RESET_PASSWORD);
    res.cookie('RESET_PASSWORD',RESET_PASSWORD, { maxAge: 15000 });
    return res.redirect('/v1/admin/login')
  }
  if(req.body.newPassword !== req.body.confirmPassword){
      // return makeResponse(res, BAD_REQUEST, false, PASSWORD_NOT_MATCH);
      return res.render('auth-set-password',{PASSWORD_NOT_MATCH})
    }
}))

// resend otp for forgot password

router.post('/resend/otp',catchAsyncAction(async(req,res)=>{
  const otp = generateOtp();
  findAdminByEmail(req)
      .then(admin => {
          if (!admin) throw new Error(INVALID_EMAIL);
          if (admin.isVerified !== true) return makeResponse(res, BAD_REQUEST,false, EMAIL_OTP_NOT_VERIFIED);
          return Promise.all(
              [
                sendEmail({
                  from: privateKey.Email,
                  to: req.body.email,
                  subject: 'OTP for password reset',
                  text: `The OTP for resetting your password is ${otp}`
              }),
                  updateOtp(req.body.email, otp)
              ]
          )
      })
      .then(async result => {
          delete result[1]?._doc?.password;
          // return makeResponse(res, SUCCESS, true, OTP_FOR_PASSWORD);
          return res.render('auth-forgot-otpVerification',{OTP_FOR_PASSWORD});
      })
      .catch(async error => {
          return makeResponse(res, BAD_REQUEST, false, error.message);
      });
}))

// resend otp for email verification

router.post(
  "/email-verification/resend/otp",
  catchAsyncAction(async (req, res) => {
    const otp = generateOtp();
    findAdminByEmail(req)
      .then((admin) => {
        if (!admin) throw new Error(INVALID_EMAIL);
        if (admin.isVerified !== true)
          // return makeResponse(res, BAD_REQUEST, false, EMAIL_OTP_NOT_VERIFIED);
          return Promise.all([
            sendEmail({
              from: privateKey.Email,
              to: req.body.email,
              subject: "OTP for Email Verification",
              text: `The OTP for verification of your email ${otp}`,
            }),
            updateOtp(req.body.email, otp),
          ]);
      })
      .then(async (result) => {
        delete result[1]?._doc?.password;
        // return makeResponse(res, SUCCESS, true, OTP_FOR_PASSWORD);
        return res.render("auth-otp-verification", {
          OTP_FOR_EMAIL_VERIFICATION,
        });
      })
      .catch(async (error) => {
        return makeResponse(res, BAD_REQUEST, false, error.message);
      });
  })
);

/// Logout

router.post('/logout',adminAuth,catchAsyncAction(async(req,res)=>{
    await req.session.destroy()
    res.redirect('/v1/admin/dashboard')

}))


export const adminController = router;
