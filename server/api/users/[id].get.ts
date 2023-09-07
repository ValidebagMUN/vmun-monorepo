import { getServerSession } from '#auth'
import { eq } from 'drizzle-orm'

import { db } from '../../db/service'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if((session?.user as any).type !== 'admin') {
        throw createError({
            status: 403,
            statusMessage: 'Unauthorized'
        });
    }
    try {
        console.log(event.context.params?.id)
        const userResponse = await db.select({
            id: users.id,
            email: users.email,
            createdAt: users.created_at,
            lastLogin: users.last_login,
            type: users.type
        }).from(users).where(eq(users.id, event.context.params?.id as any));
        if(userResponse.length === 0) {
            throw createError({
                status: 404,
                statusMessage: 'Not Found'
            })
        }
        return userResponse[0];
    } catch (e: any) {
        throw createError({
            status: 400,
            statusMessage: e.message
        })
    }
})