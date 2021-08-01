import { sign } from "jsonwebtoken"


class GenerateTokenProvider {
    async execute(userId: string) {
        const token = sign({}, "Aula_refresh_token", {
            subject: userId,
            expiresIn: "50s"
        })
        return token;
    }
}
export { GenerateTokenProvider }