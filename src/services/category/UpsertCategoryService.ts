import prismaClient from '../../prisma'

interface CategoryRequest {
    id?: number;
    name: string;
    description?:  string;
    userid: number;
}

//   id
//   name    
//   description 
//   createdById 
//   createdAt   
//   Approval 

class UpsertCategoryService {
    async execute({ id, name, description, userid }: CategoryRequest) {
        let errors: string[] = [];

        if(!name){
            errors.push("Name is mandatory!");
        }
        try {
            let category;

            if (id) {
                const existingCategory = await prismaClient.category.findUnique({
                    where: { id }
                });

                if (!existingCategory) {
                    throw new Error(`Category with id: ${id} not found`);
                }

                category = await prismaClient.category.update({
                    where: {
                        id: id
                    },
                    data: {
                        name: name,
                        description: description
                    },
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                });
            } else {
                category = await prismaClient.category.create({
                    data: {
                        name: name,
                        description: description,
                        createdById: userid
                    },
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                });
            }

            return category;

        } catch (error) {
            throw new Error(`Error in upserting category: ${error.message}`);
        }
    }
}

export { UpsertCategoryService }
