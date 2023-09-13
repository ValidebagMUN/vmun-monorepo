import { getServerSession } from "#auth";
import { eq } from "drizzle-orm";

import { db } from "~/server/db/service";
import { committees } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        if (isNaN(Number(id))) throw createError({
            status: 400
        })

        const session: any = await getServerSession(event);
        if (!session) throw createError({
            status: 403
        })

        
    } catch (e: any) {
        switch (e.statusCode) {
            case 404: {
                throw createError({
                    status: 404,
                    statusMessage: 'Not Found',
                    statusText: e.statusText
                })
            }
            case 403: {
                throw createError({
                    status: 403,
                    statusMessage: 'Forbidden',
                    statusText: e.statusText
                })
            }
            case 400: {
                throw createError({
                    status: 400,
                    statusMessage: 'Bad Request',
                    statusText: e.statusText
                })
            }
            default: {
                throw createError({
                    status: 500,
                    statusMessage: 'Internal Server Error',
                    statusText: e.statusText
                })
            }
        }
    }
})