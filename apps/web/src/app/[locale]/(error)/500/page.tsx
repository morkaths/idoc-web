import type { Metadata } from 'next';
import { MaintenanceView } from './_components/view';

export const metadata: Metadata = {
  title: '503 - System Maintenance',
  description: 'Website is under maintenance',
};

export default function MaintenanceError() {
  return <MaintenanceView />;
}
