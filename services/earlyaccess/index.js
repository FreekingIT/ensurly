import { EARLYACCESS } from "../../models/index.js";


export const AppWaiters = async(email)=>{
  return await EARLYACCESS.create({
    email:email
  })
}

export const findEarlyAccesser = async (email) => {
	return EARLYACCESS.findOne({
		where: {
			email:email
		}
	});
}