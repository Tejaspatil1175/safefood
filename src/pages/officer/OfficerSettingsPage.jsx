import React from 'react';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useAuth from '../../hooks/useAuth';

export const OfficerSettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Officer Settings
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Enforcement officer badge credentials, digital signature, and jurisdiction preferences.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Officer Profile"
          subtitle="Statutory enforcement identity"
        />

        <div className="space-y-4 max-w-lg">
          <Input
            label="Officer Name"
            defaultValue={user?.name || 'Inspector Priya Verma'}
          />
          <Input
            label="Officer Email"
            defaultValue={user?.email || 'officer@test.com'}
            disabled
          />
          <Input
            label="Jurisdiction / Zone"
            defaultValue="State Legal Metrology Cell - North Division"
          />
          <Input
            label="Inspector ID / Badge #"
            defaultValue="LM-DEL-2024-884"
            disabled
          />
          <Button variant="primary" size="md">
            Update Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OfficerSettingsPage;
