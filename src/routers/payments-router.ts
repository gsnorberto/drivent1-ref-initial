import { Router } from 'express';
import { authenticateToken, validateQuery } from '@/middlewares';
import { paymentInfoSchema } from '@/schemas';
import { getPaymentInformation } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.get('/', authenticateToken, validateQuery(paymentInfoSchema), getPaymentInformation);
// paymentsRouter.post('/process');

export { paymentsRouter };
