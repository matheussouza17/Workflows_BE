import prismaClient from "../../prisma";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface AuthRequest {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthRequest) {
        // Verificar se o email existe
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            throw new Error("User or password incorrect!"); // Mensagem de erro genérica
        }

        // Verificar senha
        const passwordMatch = await compare(password, user.password);
        
        if (!passwordMatch) {
            throw new Error("User or password incorrect!"); // Mensagem de erro genérica
        }

        // Verificar se JWT_SECRET está definido
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT secret not defined in environment variables");
        }

        // Gerar token JWT
        const token = sign(
            {
                name: user.name,
                email: user.email,
                role: user.role
            },
            jwtSecret,
            {
                subject: user.id.toString(), // Converte user.id para string
                expiresIn: '1h'
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
