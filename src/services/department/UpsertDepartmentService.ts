import prismaClient from '../../prisma'

interface DepartmentRequest {
    id?: number;
    name: string;
    code: string;
    approvalDirectorId?: number;
} 

class UpsertDepartmentService {
    async execute({ id, name, code, approvalDirectorId }: DepartmentRequest) {
        let errors: string[] = [];

        if(!name)
            errors.push("Name is required!");
        
        if(!code)
            errors.push("Code is required!");

        if (errors.length > 0) {
            throw new Error(errors.join("\n")); // Junta todos os erros em uma string
        }

        if(id){
            const existingDepartment = await prismaClient.department.findUnique({
                where: { id }
            });
    
            if (!existingDepartment) {
                throw new Error("Department with id: "+id+" not found");
            }
            const upDepartment = await prismaClient.department.update({
                where:{
                    id: id
                },
                data:{
                    name: name,
                    code:code,
                    approvalDirectorId:approvalDirectorId
                }
            });
            return upDepartment;
        }

        const department = await prismaClient.department.create({
            data: {
                name: name,
                code: code,
                approvalDirectorId: approvalDirectorId                
            }
        });
        return department;
    }
}
export { UpsertDepartmentService }