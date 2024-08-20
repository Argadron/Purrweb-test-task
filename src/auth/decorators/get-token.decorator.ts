import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const Token = createParamDecorator((data, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()

    const token = request.headers.authorization

    return token
})