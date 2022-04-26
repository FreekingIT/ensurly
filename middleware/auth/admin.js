import jwt from 'jsonwebtoken';
import { ADMIN } from '../../models/index.js';
import { makeResponse, responseMessages, statusCodes } from '../../helpers/index.js';
import { privateKey } from '../../config/privateKeys.js';
const {UNAUTHORIZED,RIGHTS_ISSUE } = responseMessages;
const {FORBIDDEN,AUTH_ERROR } = statusCodes;

const { JWT_SECRET } = privateKey;

const adminAuth = async (req, res, next) => {
	try {
		// const token = req.query['authorization'] || req.headers['authorization'];
		// console.log(req.session.accessToken);
		const token = req.session.accessToken
		if (!token) {
			return makeResponse(res, AUTH_ERROR, false, UNAUTHORIZED);
		}
		const decoded = jwt.verify(token, JWT_SECRET);
		let adminData = await ADMIN.findOne({
			where: {
				email: decoded.email,
				id: decoded.id
			}
		});
		if (adminData && decoded.role === 'admin') {
			req.adminData = adminData;
			next();
		}
		else {
			return makeResponse(res, FORBIDDEN, false, RIGHTS_ISSUE);
		}
	}
	catch (error) {
		return makeResponse(res, AUTH_ERROR, false, error.message);
	}
};

export default adminAuth;
