import { redirect } from 'next/navigation'

export default function NewFieldReportPage() {
  // Redirect to the new HDD Daily Report wizard
  redirect('/dashboard/hdd/daily-report')
}
