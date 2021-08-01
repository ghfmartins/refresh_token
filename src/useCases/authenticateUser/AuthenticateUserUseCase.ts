import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { client } from "../../prisma/client"
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken"
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider"


interface IRequest {
    username: string,
    password: string
}

class AuthenticateUserUseCase {
    async execute({ username, password }: IRequest) {
        //verificar se o usuário existe

        const userAlreadyExists = await client.user.findFirst({
            where: {
                username
            }
        })

        if (!userAlreadyExists) {
            throw new Error("User or password incorrect!")
        }

        //verificar se a senha esta incorreta
        const passwordMatch = compare(password, userAlreadyExists.password)

        if (!passwordMatch) {
            throw new Error("User or password incorrect!")
        }

        //gerar token do usuário
        const generateTokenProvider = new GenerateTokenProvider()
        const token = await generateTokenProvider.execute(userAlreadyExists.id)

        await client.refreshToken.deleteMany({
            where: {
                userId: userAlreadyExists.id
            }
        })


        const gerenateRefreshToken = new GenerateRefreshToken()
        const refreshToken = await gerenateRefreshToken.execute(userAlreadyExists.id)

        return { token, refreshToken }
    }
}
export { AuthenticateUserUseCase }