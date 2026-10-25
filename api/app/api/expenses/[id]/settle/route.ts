// Real Nessie transfers are disabled until a supported, verified transfer
// creation API and destination-account contract are available.
export const runtime = 'nodejs';
export async function POST() {
  return Response.json(
    { error: 'Real Nessie transfers are disabled. Use /api/expenses/:id/demo-settle for a clearly labeled simulated settlement.', money_transferred: false },
    { status: 501 }
  );
}
