import { privateKey } from '../../config/privateKeys.js';
import { assignToken } from "../../services/common/index.js";


export const token = ({id,email,role}) => { 
let accessToken = assignToken({ email:email, role: role, id:id },
String(privateKey.JWT_SECRET), '15d');
let refreshToken = assignToken({ email: email, role: role, id: id },
String(privateKey.JWT_SECRET), '60d');
return { accessToken, refreshToken };
}