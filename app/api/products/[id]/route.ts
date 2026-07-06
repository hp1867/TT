import { itemHandlers } from '@/lib/crud';

export const dynamic = 'force-dynamic';

const handlers = itemHandlers('products');
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
