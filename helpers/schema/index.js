import Joi from 'joi';
import { passwordRegex } from '../../helpers/index.js';

// Validation Cases
export const validationSchema = (action) => {
    switch (action) {
        case 'SIGNUP': {
            return {
                email: Joi.string().email().required(),
                name: Joi.string().required(),
                password: Joi.string().regex(passwordRegex).required(),
                confirmPassword: Joi.string().required(),
                
            };
        }
        case 'LOGIN': {
            return {
                email: Joi.string().email().required(),
                password: Joi.string().required()
            };
        }
        case 'CHANGE_PASSWORD': {
            return {
                oldPassword: Joi.string().required(),
                newPassword: Joi.string().regex(passwordRegex).required(),
                confirmPassword: Joi.string().required()
            };
        }
        case 'FORGOT_PASSWORD': {
            return {
                email: Joi.string().email().required(),
            };
        }
        case 'VERIFY-OTP': {
            return {
                email: Joi.string().email().required(),
                otp:Joi.string().required()
            };
        }
        case 'RESET_PASSWORD': {
            return {
                email: Joi.string().email().required(),
                newPassword: Joi.string().regex(passwordRegex).required(),
                confirmPassword: Joi.string().required()
            };
        }
        case 'AddSKU' : {
            return {
                productName:Joi.string().required(),
                manufacturingDate:Joi.date().required(),
                expiry:Joi.date().required(),
                companyName:Joi.string().required(),
                productImage:Joi.required(),
                batchNumber:Joi.number().required,
                mrp:Joi.required()
            }
        }
        case 'EARLYACCESS': {
            return {
                email: Joi.string().email().required(),
            };
        }
    }
    return {};
};
