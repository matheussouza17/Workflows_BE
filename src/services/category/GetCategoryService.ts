import prismaClient from '../../prisma';

interface CategoryRequest {
    id?: number;
}

class GetCategoryService {
    async execute({ id }: CategoryRequest) {
        const categories = await prismaClient.category.findMany({
            where: {
                ...(id && { id })
            }
        });

        return categories;
    }
}

export { GetCategoryService };
