import React from 'react';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useAuth from '../../hooks/useAuth';

export const UserSettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your personal profile and notification preferences.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Profile Information"
          subtitle="Update your basic account details"
        />

        <div className="space-y-4 max-w-lg">
          <Input
            label="Full Name"
            defaultValue={user?.name || 'Consumer User'}
          />
          <Input
            label="Email Address"
            defaultValue={user?.email || 'user@test.com'}
            disabled
            helperText="Email address is tied to your login identity."
          />
          <Button variant="primary" size="md">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserSettingsPage;
