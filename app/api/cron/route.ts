import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // This endpoint can be called by a cron service like cron-job.org
  // to trigger daily notifications at 1pm

  const authHeader = request.headers.get('authorization')

  // Simple auth check (in production, use a proper secret)
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // This would typically send emails or push notifications
  // For now, it just confirms the cron job ran

  return NextResponse.json({
    success: true,
    message: 'Daily ASMR notification triggered',
    timestamp: new Date().toISOString()
  })
}
