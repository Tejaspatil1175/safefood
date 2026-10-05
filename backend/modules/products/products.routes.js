import { Router } from 'express';
import { getProduct } from './products.controller.js';

export const productsRouter = Router();

productsRouter.get('/:barcode', getProduct);

export default productsRouter;
