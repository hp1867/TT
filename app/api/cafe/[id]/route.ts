import { itemHandlers } from '@/lib/crud';

export const dynamic = 'force-dynamic';

const handlers = itemHandlers('cafeItems');
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
