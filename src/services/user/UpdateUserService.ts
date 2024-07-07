import prismaClient from '../../prisma';
import { hash, compare } from 'bcryptjs';


interface UserRequest {
    id: number;
    name: string;
    email: string;
    password?: string;
    password_old?: string;
    file?: Buffer;
    role: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
    departmentId: number;
}

class UpdateUserService {
    async execute({ id, name, email, password, password_old, file, role, departmentId }: UserRequest) {
        let errors: string[] = [];
        
        if(!id){
            errors.push("Id is required!");
        }
        
        // Validação de email
        if (!email) {
            errors.push("Email is required!");
        }

        // Validação de nome
        if (!name) {
            errors.push("Name is required!");
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

        // Buscar usuário pelo ID
        const user = await prismaClient.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Preparar dados para atualização
        const updateData: any = {
            name: name,
            email: email,
            role: role,
            departmentId: Number(departmentId)
        };

        // Validar e atualizar a senha se fornecida
        if (password) {
            if (!password_old) {
                throw new Error("Old password is required to update the password");
            }

            const passwordMatch = await compare(password_old, user.password);
            if (!passwordMatch) {
                throw new Error("Old password does not match");
            }

            updateData.password = await hash(password, 8);
        }

        // Atualizar arquivo apenas se fornecido
        if (file) {
            updateData.file = file;
        }

        // Se não houver erros, prossegue com a atualização do usuário
        const updatedUser = await prismaClient.user.update({
            where: {
                id: id
            },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                departmentId: true
            }
        });

        return updatedUser;
    }
}

export { UpdateUserService };
