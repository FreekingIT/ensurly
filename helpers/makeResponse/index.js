export const responseMessages = {
    'ACCOUNT_DISABLED': 'Your account is disabled please contact to admin',
    'ALREADY_EXIST': 'Email aleardy exist',
    'ALREADY_REGISTER': 'Email already registered',
    'REGISTERD': 'Registered Successfully',
    'GROUP_CREATED': 'Group Created Successfully',
    'INVALID_EMAIL': 'Email not exist',
    'INCORRECT_PASSWORD': 'Incorrect password',
    'LOGIN': 'Logged in successfully',
    'USER_NOT_FOUND': 'User not found',
    'UNAUTHORIZED': 'Unauthorized',
    'FETCH_CONTACTS': 'Fetch Contacts Successfully',
    'FETCH_TALKIE_CONTACTS': 'Fetch Talkie Contacts Successfully',
    'FETCH_All_Group': 'Fetch All Group Successfully',
    'LOGIN': 'Login successfully',
    'OTP_MISMATCH': 'OTP mismatched',
    
    'INVALID_PASSWORD': 'Invalid old password',
    'INVALID': 'Invalid email or password',
    'PASSWORD_CHANGED': 'Password Changed Successfully',
    'ADMIN_ADDED': 'Admin added successfully',
    'USER_NOTFOUND': 'User not found',
    'RESET_PASSWORD': 'Password Reset Successfully',
    'OTP_FOR_PASSWORD': 'OTP For Password Reset Sent To Your Email',
    'OTP_FOR_EMAIL_VERIFICATION': 'OTP For Email Verification Sent To Your Email',
    'VERIFY_OTP': 'OTP Verified',
    'EMAIL_NOT_REGISTER': 'Email not registered',
    // 'ALREADY_EXIST': 'Aleardy Exist Please Login',
    'PASSWORD_NOT_MATCH':'Password and ConfirmPassword are not matching',
    'RIGHTS_ISSUE': "You do not have sufficient rights",
    'SKUAdded':'Your SKU has been added Successfully',
    'DeleteSKU':'Your SKU has been deleted Successfully',
    'SKUDetail':'SKU Detail has been fetch successfully',
    'SKUUpdate':'SKU has been updated successfully',
    'SKUFetch':'SKU Details has been fetch Successfully',
    'ID_NOT_EXIST':'This ID Does not exist',
    'EMAIL_OTP_NOT_VERIFIED':"Your Email is already registered with us but verification is pending.For Verification we have send OTP to your email"
    
}

export const notificationPayload = {}

export const statusCodes = {
    'SUCCESS': 200,
    'RECORD_CREATED': 201,
    'BAD_REQUEST': 400,
    'AUTH_ERROR': 401,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'INVALID_REQUEST': 405,
    'RECORD_ALREADY_EXISTS': 409,
    'SERVER_ERROR': 500
}

const makeResponse = async (res, statusCode, success, message, payload = null, meta = {}) =>
    new Promise(resolve => {
        res.status(statusCode)
            .send({
                success,
                code: statusCode,
                message,
                data: payload,
                meta
            });
        resolve(statusCode);
    });

export { makeResponse };

export const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
