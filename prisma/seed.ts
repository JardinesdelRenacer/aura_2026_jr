import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const master = await prisma.user.create({
        data: {
            email: "master@jardines.co",
            password: "123456",
            role: "MASTER",
        },
    });
    
    console.log(master);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });