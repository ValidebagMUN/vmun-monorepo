import { getServerSession } from '#auth'
import bcrypt from 'bcrypt'

import { db } from '~/server/db/service'
import { users, InsertUser } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event);
    if((session?.user as any).type !== 'admin') {
        throw createError({
            status: 403,
            statusMessage: 'Forbidden'
        });
    }
    try {
        const body = await readBody(event);
        
        const newUser: InsertUser = {
            ...body,
            password: await bcrypt.hash(body.password, 10)
        };
        const result = await db.insert(users).values(newUser);
        return "200 OK"
    } catch (e: any) {
        throw createError({
            status: 400,
            statusMessage: e.message
        })
    }
})