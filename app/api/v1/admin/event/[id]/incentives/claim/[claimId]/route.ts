import db from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"

import { currentUserOrThrowAuthError } from "@/lib/auth"
import { routeErrorHandler } from "@/errors/route-error-handler"
import { eventIdAndClaimIdParamSchema } from "@/validation-schema/api-params"

type TParams = { params : { id : number, claimId : number }}

export const DELETE = async ( req : NextRequest , { params } : TParams) => {
    try{
        await currentUserOrThrowAuthError();
        console.log(params)
        const { id : eventId, claimId } = eventIdAndClaimIdParamSchema.parse(params);

        const deletedClaim = await db.incentiveClaims.delete({
            where : {
                eventId,
                id : claimId
            }
        })

        return NextResponse.json(deletedClaim)
    }catch(e){
        return routeErrorHandler(e, req)
    }
}

// for releasing of claims that is claimed online
export const PATCH = async ( req : NextRequest , { params } : TParams ) => {
    try{
        const currentUser = await currentUserOrThrowAuthError();
        const { id : eventId, claimId } = eventIdAndClaimIdParamSchema.parse(params);

        const updatedClaimEntry = await db.incentiveClaims.update({
            where : {
                id : claimId, 
                eventId
            },
            data : {
                released : true,
                releasedAt : new Date(),
                releasedById : currentUser.id
            }
        })

        return NextResponse.json(updatedClaimEntry)
    }catch(e){
        return routeErrorHandler(e, req);
    }
}