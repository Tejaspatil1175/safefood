import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';
import Badge from '../common/Badge';

/**
 * ComplianceChecklistCard component evaluating the 5 core declaration areas under PCR 2011
 */
export const ComplianceChecklistCard = ({ checklist = [] }) => {
  const getStatusIcon = (status) => {
    switch (String(status).toLowerCase()) {
      case 'passed':
      case 'compliant':
        return (
          <div className="h-7 w-7 rounded-full bg-success-50 text-success-600 border border-success-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        );
      case 'warning':
      case 'partial':
        return (
          <div className="h-7 w-7 rounded-full bg-warning-50 text-warning-600 border border-warning-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
        );
      case 'failed':
      case 'non-compliant':
      default:
        return (
          <div className="h-7 w-7 rounded-full bg-error-50 text-error-600 border border-error-500/20 flex items-center justify-center shrink-0">
            <XCircle className="h-4 w-4" />
          </div>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (String(status).toLowerCase()) {
      case 'passed':
      case 'compliant':
        return (
          <Badge variant="success" size="sm">
            Passed
          </Badge>
        );
      case 'warning':
      case 'partial':
        return (
          <Badge variant="warning" size="sm">
            Warning
          </Badge>
        );
      case 'failed':
      case 'non-compliant':
      default:
        return (
          <Badge variant="error" size="sm">
            Failed
          </Badge>
        );
    }
  };

  return (
    <Card className="p-6">
      <CardHeader
        title="Statutory Checklist Evaluation"
        subtitle="Verification against Legal Metrology (Packaged Commodities) Rules 2011"
      />

      <div className="space-y-3.5">
        {checklist.map((item, idx) => (
          <div
            key={item.key || idx}
            className="p-4 rounded-xl border border-border bg-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-surface-muted"
          >
            <div className="flex items-start gap-3.5">
              {getStatusIcon(item.status)}
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  {item.title}
                </h4>
                {item.detail && (
                  <p className="text-xs text-neutral-600 mt-0.5 max-w-xl leading-relaxed">
                    {item.detail}
                  </p>
                )}
              </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
              {getStatusBadge(item.status)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ComplianceChecklistCard;
