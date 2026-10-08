import React from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';
import Badge from '../common/Badge';

/**
 * IssueCard component rendering detected non-compliance issues and statutory violations
 */
export const IssueCard = ({ issues = [] }) => {
  if (!issues || issues.length === 0) {
    return (
      <Card className="p-6 border-success-500/30 bg-success-50/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-success-100 text-success-700 flex items-center justify-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-success-900">
              No Non-Compliance Violations Detected
            </h4>
            <p className="text-xs text-success-700 mt-0.5">
              All mandatory Legal Metrology declaration standards have been met satisfactorily.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const getSeverityBadge = (severity) => {
    switch (String(severity).toLowerCase()) {
      case 'high':
      case 'critical':
        return <Badge variant="error" size="sm">High Severity</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Medium Severity</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Low Severity</Badge>;
    }
  };

  return (
    <Card className="p-6 border-error-200">
      <CardHeader
        title={`Detected Violations & Deficiencies (${issues.length})`}
        subtitle="Specific Legal Metrology non-compliance notices requiring correction or investigation"
      />

      <div className="space-y-3.5">
        {issues.map((issue, idx) => (
          <div
            key={issue.id || idx}
            className="p-4 rounded-xl border border-error-500/20 bg-error-50/30 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <span className="h-6 w-6 rounded-full bg-error-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">
                  {issue.title}
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  {issue.description}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {getSeverityBadge(issue.severity)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default IssueCard;
