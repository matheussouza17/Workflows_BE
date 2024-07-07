import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'

interface UserRequest {
    name: string;
    email: string;
    password: string;
    file?: Buffer;
    role: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
    departmentId: number;
}

class CreateUserService {
    async execute({ name, email, password, file, role, departmentId }: UserRequest) {
        let errors: string[] = [];

        // Validação de email
        if (!email) {
            errors.push("Email is required!");
        } else {
            // Verifica se o email já existe
            const userAlreadyExist = await prismaClient.user.findFirst({
                where: {
                    email: email
                }
            });
            if (userAlreadyExist) {
                errors.push("Email already exists!");
            }
        }

        // Validação de nome
        if (!name) {
            errors.push("Name is required!");
        }

        // Validação de senha
        if (!password) {
            errors.push("Password is required!");
        }

        // Validação de role
        if (!role) {
            errors.push("Role is required!");
        }

        // Validação de departmentId
        if (!departmentId) {
            errors.push("Department ID is required!");
        }

        // Se houver erros, lança uma exceção com a lista de erros
        if (errors.length > 0) {
            throw new Error(errors.join("\n")); // Junta todos os erros em uma string
        }

        const passwordHash = await hash(password, 8);

        // Se não houver erros, prossegue com a criação do usuário
        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash,
                file: file,
                role: role,
                departmentId:  Number(departmentId)
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                departmentId: true
            }
        });

        return user;
    }
}

export { CreateUserService }
