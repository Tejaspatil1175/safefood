import { getProductByBarcode } from './products.service.js';

export async function getProduct(req, res, next) {
  try {
    const product = await getProductByBarcode(req.params.barcode);
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
}

export default {
  getProduct,
};
