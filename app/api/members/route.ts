import { collectionHandlers } from '@/lib/crud';

export const dynamic = 'force-dynamic';

const handlers = collectionHandlers('members', 'p');
export const GET = handlers.GET;
export const POST = handlers.POST;
