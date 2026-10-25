import { pool } from '@/lib/db';
import { actor, positiveId, bad } from '@/lib/phase2';

export const runtime = 'nodejs';
type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const userId = actor(req);
  const expenseId = positiveId((await params).id);
  if (!userId || !expenseId) return bad('invalid request');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `SELECT ex.id, ex.owed_by, ex.amount, ex.settled, ex.settlement_state,
              ex.nessie_transfer_id
         FROM expenses ex
         JOIN events e ON e.id = ex.event_id
         JOIN group_members gm ON gm.group_id = e.group_id AND gm.user_id = $2
        WHERE ex.id = $1
        FOR UPDATE OF ex`,
      [expenseId, userId]
    );
    if (!result.rowCount) {
      await client.query('ROLLBACK');
      return bad('expense not found or forbidden', 403);
    }
    const expense = result.rows[0];
    if (Number(expense.owed_by) !== userId) {
      await client.query('ROLLBACK');
      return bad('only the debtor can simulate settlement', 403);
    }
    if (expense.settled && expense.settlement_state === 'simulated') {
      await client.query('COMMIT');
      return Response.json({ expense_id: expenseId, amount: expense.amount,
        settled: true, settlement_state: 'simulated', payment_provider: 'demo',
        money_transferred: false, reused: true });
    }
    if (expense.settled || expense.settlement_state !== 'unpaid' || expense.nessie_transfer_id) {
      await client.query('ROLLBACK');
      return bad('expense is not eligible for demo settlement; review current state', 409);
    }
    await client.query(
      `UPDATE expenses
          SET settled = true, settlement_state = 'simulated', settled_at = now(),
              nessie_transfer_id = NULL
        WHERE id = $1`,
      [expenseId]
    );
    await client.query('COMMIT');
    return Response.json({ expense_id: expenseId, amount: expense.amount,
      settled: true, settlement_state: 'simulated', payment_provider: 'demo',
      money_transferred: false, reused: false });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Demo settlement failed', error);
    return Response.json({ error: 'demo settlement failed' }, { status: 500 });
  } finally {
    client.release();
  }
}
