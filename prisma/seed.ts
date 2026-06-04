import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Hash de contraseña seguro
    const hashedPasswordMaster = await bcrypt.hash("123456", 10);
    const hashedPasswordAdmin = await bcrypt.hash("123456", 10);

    // Eliminar usuarios existentes para evitar conflictos de unicidad
    await prisma.user.deleteMany({});

    // Crear usuario MASTER
    const master = await prisma.user.create({
        data: {
            email: "master@jardines.co",
            password: hashedPasswordMaster,
            role: "MASTER",
        },
    });

    // Crear usuario ADMIN
    const admin = await prisma.user.create({
        data: {
            email: "admin@jardines.co",
            password: hashedPasswordAdmin,
            role: "ADMIN",
        },
    });

    console.log("✓ Usuario MASTER creado:", master.email);
    console.log("✓ Usuario ADMIN creado:", admin.email);
    console.log("\nCRED­EN­CIA­LES­ DE­ PRU­EBA:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("MASTER:");
    console.log("  Email:    master@jardines.co");
    console.log("  Password: 123456");
    console.log("");
    console.log("ADMIN:");
    console.log("  Email:    admin@jardines.co");
    console.log("  Password: 123456");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });