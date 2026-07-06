import { collectionHandlers } from '@/lib/crud';

export const dynamic = 'force-dynamic';

const handlers = collectionHandlers('events', 'e');
export const GET = handlers.GET;
export const POST = handlers.POST;
