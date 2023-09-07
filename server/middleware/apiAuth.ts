import { getServerSession } from '#auth'

const publicRoutes: string[] = useRuntimeConfig().publicRoutes;

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if(!publicRoutes.includes(event.path) && !session && event.path.includes('/api/') && !event.path.includes('/api/auth/')) {
        throw createError({
            status: 403,
            statusMessage: 'Unauthorized'
        })
    }
});

