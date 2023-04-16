import { Router } from 'express';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { paymentInfoSchema, paymentDataSchema } from '@/schemas';
import { getPaymentInformation, makePayment } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.get('/', authenticateToken, validateQuery(paymentInfoSchema), getPaymentInformation);
paymentsRouter.post('/process', authenticateToken, validateBody(paymentDataSchema), makePayment);

export { paymentsRouter };
