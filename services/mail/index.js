import nodemailer from 'nodemailer';
const { createTransport } = nodemailer;
import { privateKey } from '../../config/privateKeys.js';

const sendEmail = async (toMail) =>
	new Promise((resolve, reject) => {
		const transport = createTransport({
			service: 'gmail',
			auth: {
				user: privateKey.EMAIL,
				pass: privateKey.PASSWORD
			}
		});

		transport.sendMail(
		 toMail,
			(error, response) => {
				if (error) {
					reject(error);
				} else {
					resolve(response.messageId);
				}
				transport.close();
			}
		);
	});

export { sendEmail };
