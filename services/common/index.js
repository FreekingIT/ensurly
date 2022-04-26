import bcrypt from 'bcrypt';
const { compare, hash } = bcrypt;
import jsonwebtoken from 'jsonwebtoken';
const { sign } = jsonwebtoken;

const matchPassword = async (raw, encrypted) => new Promise((resolve, reject) => {
	compare(raw, encrypted)
		.then(resolve)
		.catch(reject);
});

const hashPassword = async (rawPassword) => new Promise((resolve, reject) => {
	hash(rawPassword, 10)
		.then(resolve)
		.catch(reject);
});

const assignToken = (payload, secret, expiresIn) => sign(payload, secret, { expiresIn });

const generateOtp = () => Math.floor((Math.random() + 1) * 1000);

export { matchPassword, assignToken, hashPassword, generateOtp };
