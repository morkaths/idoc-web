'use client';

import { useState } from 'react';
import { Shield, Key } from 'lucide-react';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Label } from '@repo/ui/components/label';
import { Separator } from '@repo/ui/components/separator';
import { Switch } from '@repo/ui/components/switch';
import { ChangePasswordDialog } from './change-password-dialog';

export function SecurityTab() {
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security and authentication.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label className='text-base'>Password</Label>
                <p className='text-muted-foreground text-sm'>Last changed 3 months ago</p>
              </div>
              <Button variant='outline' onClick={() => setShowChangePasswordDialog(true)}>
                <Key className='mr-2 h-4 w-4' />
                Change Password
              </Button>
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label className='text-base'>Two-Factor Authentication</Label>
                <p className='text-muted-foreground text-sm'>
                  Add an extra layer of security to your account
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700'>
                  Enabled
                </Badge>
                <Button variant='outline' size='sm'>
                  Configure
                </Button>
              </div>
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label className='text-base'>Login Notifications</Label>
                <p className='text-muted-foreground text-sm'>
                  Get notified when someone logs into your account
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <Label className='text-base'>Active Sessions</Label>
                <p className='text-muted-foreground text-sm'>
                  Manage devices that are logged into your account
                </p>
              </div>
              <Button variant='outline'>
                <Shield className='mr-2 h-4 w-4' />
                View Sessions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      />
    </>
  );
}
