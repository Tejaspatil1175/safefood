import { getActiveRuleSet } from './rules.service.js';

export async function getActiveRules(req, res, next) {
  try {
    const rules = await getActiveRuleSet();
    return res.status(200).json(rules);
  } catch (err) {
    return next(err);
  }
}

export default {
  getActiveRules,
};
