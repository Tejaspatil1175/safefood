import React from 'react';
import { Lightbulb, ShieldCheck, AlertTriangle, FileCheck, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';
import Badge from '../common/Badge';

/**
 * RecommendationCard component presenting statutory corrective guidance & officer advisories
 */
export const RecommendationCard = ({
  isCompliant = false,
  recommendations = [],
  className = '',
}) => {
  const defaultCompliantRecommendations = [
    {
      id: 1,
      title: 'Packaging Approved for General Distribution',
      description: 'The sampled commodity complies with mandatory declaration requirements under Legal Metrology (Packaged Commodities) Rules 2011. No statutory intervention required.',
      type: 'success',
    },
    {
      id: 2,
      title: 'Routine Market Surveillance',
      description: 'Include commodity in scheduled quarterly retail audit samples to ensure ongoing batch consistency.',
      type: 'info',
    },
  ];

  const defaultViolationRecommendations = [
    {
      id: 1,
      title: 'Issue Statutory Notice under PCR Rule 6(11)',
      description: 'Serve Form-A statutory rectification notice to the manufacturer and packer regarding the absence of Unit Sale Price (USP). Allow 15 days for formal response.',
      type: 'warning',
    },
    {
      id: 2,
      title: 'Direct Font & Character Height Rectification',
      description: 'Order packer to calibrate printing plates to ensure net weight numeral heights meet the statutory 4.0mm threshold on future batches.',
      type: 'warning',
    },
    {
      id: 3,
      title: 'Sample Additional Retail Units',
      description: 'Inspect 5 additional packaged units from the retail premises to verify whether weight variance is systemic or isolated to this batch.',
      type: 'info',
    },
  ];

  const displayList =
    recommendations && recommendations.length > 0
      ? recommendations
      : isCompliant
      ? defaultCompliantRecommendations
      : defaultViolationRecommendations;

  return (
    <Card className={`p-6 ${className}`}>
      <CardHeader
        title="Statutory Recommendations & Officer Advisory"
        subtitle="Recommended corrective actions and enforcement procedures under PCR 2011"
      />

      <div className="space-y-3.5">
        {displayList.map((rec, idx) => (
          <div
            key={rec.id || idx}
            className={`p-4 rounded-xl border flex items-start gap-3.5 transition-colors ${
              rec.type === 'warning'
                ? 'bg-warning-50/40 border-warning-500/20'
                : rec.type === 'success'
                ? 'bg-success-50/40 border-success-500/20'
                : 'bg-surface-subtle border-border'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {rec.type === 'warning' ? (
                <div className="h-7 w-7 rounded-lg bg-warning-100 text-warning-700 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              ) : rec.type === 'success' ? (
                <div className="h-7 w-7 rounded-lg bg-success-100 text-success-700 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              ) : (
                <div className="h-7 w-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-neutral-900 leading-tight">
                  {rec.title}
                </h4>
                {rec.type === 'warning' && (
                  <Badge variant="warning" size="sm">
                    Action Required
                  </Badge>
                )}
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {rec.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecommendationCard;
