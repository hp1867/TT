// Simple shared-secret gate for the control panel.
// Override by setting ADMIN_PASSWORD in an .env.local file inside the tt folder.
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sportsx2026';

export function authorized(req: Request): boolean {
  const token = req.headers.get('x-admin-token');
  return token === ADMIN_PASSWORD;
}
