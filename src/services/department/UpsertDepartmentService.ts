import prismaClient from '../../prisma';

interface DepartmentRequest {
  id?: number;
  name: string;
  code: string;
  approvalDirectorId?: string | number;
}

class UpsertDepartmentService {
  async execute({ id, name, code, approvalDirectorId }: DepartmentRequest) {
    const errors: string[] = [];

    if (!name) errors.push("Name is required!");
    if (!code) errors.push("Code is required!");

    if (errors.length > 0) {
      throw new Error(errors.join("\n")); // Junta todos os erros em uma string
    }

    try {
      let department;

      // Certificar que approvalDirectorId é do tipo number ou null
      const parsedApprovalDirectorId = approvalDirectorId ? parseInt(approvalDirectorId as string, 10) : null;

      if (id) {
        const existingDepartment = await prismaClient.department.findUnique({
          where: { id }
        });

        if (!existingDepartment) {
          throw new Error(`Department with id: ${id} not found`);
        }

        console.log(parsedApprovalDirectorId);
        department = await prismaClient.department.update({
          where: { id: id },
          data: {
            name: name,
            code: code,
            approvalDirectorId: parsedApprovalDirectorId
          },
          select: {
            id: true,
            name: true,
            code: true,
            approvalDirectorId: true
          }
        });
      } else {
        department = await prismaClient.department.create({
          data: {
            name: name,
            code: code,
            approvalDirectorId: parsedApprovalDirectorId
          },
          select: {
            id: true,
            name: true,
            code: true,
            approvalDirectorId: true
          }
        });
      }

      return department;

    } catch (error) {
      throw new Error(`Error in upserting department: ${error.message}`);
    }
  }
}

export { UpsertDepartmentService };
