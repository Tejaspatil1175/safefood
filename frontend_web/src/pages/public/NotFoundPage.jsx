import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-primary-600 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-neutral-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-neutral-500 max-w-sm mb-6">
        The requested page does not exist or you may not have permission to view it.
      </p>
      <Link to="/">
        <Button variant="primary">Return to Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
