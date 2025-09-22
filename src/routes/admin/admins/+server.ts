import type { RequestHandler } from '@sveltejs/kit';
import { listAdmins, createAdmin, deleteAdmin } from '$lib/db/mysql';
import { responseError, responseSuccess, HTTP } from '$lib/apis';
import { getSessionBySessionId } from '$lib/db/sessions';

function requireAdmin(event) {
  const sessionId = event.cookies.get('sessionId');
  const session = getSessionBySessionId(sessionId);
  if (!session || session.user.flag_is_admin !== 1) {
    throw responseError('admin privileges required', HTTP.UNAUTHORIZED);
  }
  return session;
}

export const GET: RequestHandler = async (event) => {
  requireAdmin(event);
  const admins = await listAdmins();
  // Hide password/salt
  const safe = admins.map(a => ({ uid: a.uid, email: a.email, team_num: a.team_num, created: a.created }));
  return new Response(JSON.stringify({ admins: safe }), { status: 200 });
};

export const POST: RequestHandler = async (event) => {
  requireAdmin(event);
  const body = await event.request.json();
  const { email, password } = body;
  if (!email || !password) return responseError('email and password required', HTTP.BAD_REQUEST);
  if (password.length < 8) return responseError('password must be at least 8 chars', HTTP.BAD_REQUEST);
  try {
  const created = await createAdmin(email, password);
  return responseSuccess('admin created', { uid: created.uid, email: created.email }, HTTP.CREATED);
  } catch (e) {
    return responseError('failed to create admin', HTTP.INTERNAL_SERVER_ERROR);
  }
};

export const DELETE: RequestHandler = async (event) => {
  requireAdmin(event);
  const url = new URL(event.request.url);
  const uidParam = url.searchParams.get('uid');
  if (!uidParam) return responseError('uid required', HTTP.BAD_REQUEST);
  const uid = Number(uidParam);
  if (!Number.isFinite(uid)) return responseError('uid must be number', HTTP.BAD_REQUEST);
  const ok = await deleteAdmin(uid);
  if (!ok) return responseError('cannot delete protected or nonexistent admin', 403);
  return responseSuccess('admin deleted');
};
