import prismaClient from '../../prisma';
import {GetManagerOfDepartment} from '../user/GetManagerOfDepartment'
interface ProcessRequest {
    id?: number;
    approvalId: number;
    departmentFromId: number;
    departmentToId: number;
    roleFrom: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
    roleTo: 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO';
    executedById: number;
    userToId?: number;
    comment?: string;
    action: 'Approved'| 'Rejected'| 'Cancelled'| 'NotExecuted';
    status: 'Pending' |'InProgress'|'Completed'|'Cancelled';
}


class CreateProcessService {
    async execute(approvalId : number) {
        const getManagerOfDepartment = new GetManagerOfDepartment();
        if (!approvalId) {
            throw new Error("ApprovalID missing.");
        }
        let approval = await prismaClient.approval.findFirst({
            where:{
                id: approvalId
            }
        });
        
        let userCreated = await prismaClient.user.findFirst({
            where: { id: approval.createdById }
        });
        let userManager;
        let process;
        //Verificar para onde direcionar a aprovação
        if(userCreated.role === `Employee`){
            userManager = await getManagerOfDepartment.execute(userCreated.departmentId);
            process = await prismaClient.process.create({
                data:{
                    approvalId: approvalId,
                    departmentFromId: userCreated.departmentId,
                    departmentToId: userManager.departmentId,
                    roleFrom: userCreated.role,
                    roleTo: userManager.role,
                    executedById: userCreated.id,
                    userToId: userManager.id,
                    action: 'NotExecuted',
                    status: 'Pending'                    
                }
                
            })
        }
        else if (userCreated.role === 'Director' || userCreated.role === 'Manager') {
            userManager = await getManagerOfDepartment.accounting();
            process = await prismaClient.process.create({
                data:{
                    approvalId: approvalId,
                    departmentFromId: userCreated.departmentId,
                    departmentToId: userManager.departmentId,
                    roleFrom: userCreated.role,
                    roleTo: userManager.role,
                    executedById: userCreated.id,
                    userToId: userManager.id,
                    action: 'NotExecuted',
                    status: 'InProgress'                    
                }
                
            })
        }
        else{
            throw new Error(`Application not support this operation!`);
        }


            return process;

        } catch (error) {
            throw new Error(`Error in upserting process: ${error.message}`);
        }
}

export { CreateProcessService };
