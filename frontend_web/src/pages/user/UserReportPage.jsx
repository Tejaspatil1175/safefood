import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, History } from 'lucide-react';
import scanService from '../../services/scan';
import { ComplianceResult } from '../../components/reports';
import { SkeletonCard } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';

export const UserReportPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scanService.getScanById(id);
      if (!data) {
        setError('Report not found');
      } else {
        setReport(data);
      }
    } catch (err) {
      console.error('Failed to load user scan report', err);
      setError('Unable to load inspection report. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-6 w-48 bg-neutral-200 rounded animate-pulse" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <ErrorState
          title="Scan Result Not Found"
          description={error || `No label verification record found with ID ${id}.`}
          onRetry={fetchReport}
        />
        <div className="mt-4 text-center">
          <Link to="/app/user/history">
            <Button variant="secondary" icon={ArrowLeft}>
              Back to My Scan History
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-1">
        <Link
          to="/app/user/history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My History</span>
        </Link>
      </div>

      <ComplianceResult
        scanData={report}
        historyUrl="/app/user/history"
        simplified={true}
      />
    </div>
  );
};

export default UserReportPage;
