import prismaClient from "../../prisma";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface AuthRequest {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthRequest) {
        // verificar se o email existe
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user) {
            throw new Error("User/password incorrect!");
        }

        // verificar senha
        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("User/password incorrect!");
        }

        // gerar token JWT
        const token = sign(
            {
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET as string, // garante que JWT_SECRET é uma string
            {
                subject: user.id.toString(), // converte user.id para string
                expiresIn: '30d'
            }
        );

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
        };
    }
}

export { AuthUserService };
