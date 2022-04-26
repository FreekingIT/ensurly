import Router from 'express';
import { adminController,addSKU,analytics,consumer} from '../controllers/index.js'


const router = Router();

router.use('/admin', adminController)
router.use('/sku', addSKU);
router.use('/analytics', analytics);
router.use('/consumer',consumer);



export { router };
 