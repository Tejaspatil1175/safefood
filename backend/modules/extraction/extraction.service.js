import { groupWordsIntoLines } from './lineGrouping.js';
import { extractNetQuantity } from './extractors/netQuantity.js';
import { extractMrp } from './extractors/mrp.js';
import { extractDates } from './extractors/dates.js';
import { extractManufacturer } from './extractors/manufacturer.js';
import { extractCustomerCare } from './extractors/customerCare.js';
import { extractFssai } from './extractors/fssai.js';
import { extractCountryOfOrigin } from './extractors/countryOfOrigin.js';
import { extractProductName } from './extractors/productName.js';

export class RuleBasedExtractorProvider {
  extract(words = []) {
    const lines = groupWordsIntoLines(words);

    const netQuantity = extractNetQuantity(lines);
    const mrp = extractMrp(lines);
    const { dateOfManufacture, expiryOrBestBefore } = extractDates(lines);
    const manufacturer = extractManufacturer(lines);
    const customerCare = extractCustomerCare(lines);
    const fssai = extractFssai(lines);
    const countryOfOrigin = extractCountryOfOrigin(lines);
    const productName = extractProductName(lines);

    return {
      netQuantity,
      mrp,
      dateOfManufacture,
      expiryOrBestBefore,
      manufacturer,
      customerCare,
      fssai,
      countryOfOrigin,
      productName,
      lines,
    };
  }
}

const defaultProvider = new RuleBasedExtractorProvider();

export function extractFields(words = [], { provider = defaultProvider } = {}) {
  return provider.extract(words);
}

export default {
  extractFields,
  RuleBasedExtractorProvider,
};
