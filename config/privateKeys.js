import dotenv from 'dotenv';
dotenv.config();


let {
    databaseName,
    dbUsername,
    dbPassword,
    dbHost,     
    PORT,
    nodemailerEmail,
    nodemailerPassword,
    JWT_SECRET,
    clientID,
    clientSecret,
    SessionKey
} = process.env;

export const privateKey = {
    'DB_NAME': databaseName,
    'DB_USER_NAME': dbUsername,
    'DB_PASSWORD':dbPassword,
    'DB_HOST':dbHost,
    'PORT': PORT,
    'JWT_SECRET':JWT_SECRET,
    'EMAIL': nodemailerEmail,
    'PASSWORD': nodemailerPassword,
    'clientSecret':clientSecret,
    'clientID':clientID,
    'SessionKey':SessionKey
};
