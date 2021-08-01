import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";



export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization

    if (!authToken) {
        return response.status(401).json({
            message: "Token is missing"
        })
    }

    const [, token] = authToken.split(" ") //para separar o Bearer que vem junto do token no authToken

    try {
        verify(token, "Aula_refresh_token")

        return next()

    } catch (error) {
        return response.status(401).json({
            message: "Token invalid"
        })
    }
}