import { SKUS } from '../../models/index.js';
import {Op} from 'sequelize';


export const countSkU = async(start,end)=>{
   return  await SKUS.count({
    where:{createdAt: {
        [Op.between]: [start, end],
       }}
});
  }

  export const getSkU = async(start,end)=>{
    return  await SKUS.findAll({
     where:{createdAt: {
         [Op.between]: [start, end],
        }}
 });
   }  
