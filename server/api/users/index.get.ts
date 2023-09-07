import { db } from '../../db/service'
import { users } from '../../db/schema'

export default defineEventHandler(async () => {
    try {
        const userResponse = await db.select({
            id: users.id,
            email: users.email,
            createdAt: users.created_at,
            lastLogin: users.last_login,
            type: users.type
        }).from(users)
        return userResponse;
    } catch (e: any) {
        throw createError({
            status: 400,
            statusMessage: e.message
        })
    }
})