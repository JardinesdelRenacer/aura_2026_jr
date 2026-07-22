import { prisma } from "@/src/lib/prisma";

export async function getDashboardMetrics() {
    // Obituarios
    const [ 
        totalObituaries,
        activeObituaries,
        finishedObituaries,
        archivedObituaries,
    ] = await Promise.all([
        prisma.obituario.count(),
        
        prisma.obituario.count({ 
            where: { estado: "ACTIVO"},
        }),

        prisma.obituario.count({
            where: { estado: "FINALIZADO"},
        }),

        prisma.obituario.count({
            where: { estado: "ARCHIVADO"}
        }),
    ]);

    // Condolencias
    const [
        totalCondolences,
        pendingCondolences,
        deliveredCondolences,
        archivedCondolences,
    ] = await Promise.all([
        prisma.condolencia.count(),

        prisma.condolencia.count({
            where: { estado: "PENDIENTE"},
        }),

        prisma.condolencia.count({
            where: { estado: "ENTREGADA"},
        }),

        prisma.condolencia.count({
            where: { estado: "ARCHIVADA"},
        }),
    ]);

    // Sedes 
    const [
        totalBranches,
        activeBranches,
    ] = await Promise.all([
        prisma.sede.count(),

        prisma.sede.count({
            where: { estado: "ACTIVA"},
        }),
    ]);

    // Pantallas

    const [
        totalScreens,
        onlineScreens,
        offlineScreens,
        maintenanceScreens,
        errorScreens,
    ] = await Promise.all([
        prisma.pantallaCliente.count(),

        prisma.pantallaCliente.count({
            where: { estado: "ONLINE"},
        }),

        prisma.pantallaCliente.count({
            where: { estado: "OFFLINE"},
        }),

        prisma.pantallaCliente.count({
            where: { estado: "MANTENIMIENTO"},
        }),

        prisma.pantallaCliente.count({
            where: { estado: "ERROR"},
        }),
    ]);

    //Usuarios
    const [
        totalUsers,
        activeUsers,
    ] = await Promise.all([
        prisma.user.count(),

        prisma.user.count({
            where: { estado: "ACTIVO" },
        }),
    ]);

    //Últimos obituarios

    const latestObituaries = await prisma.obituario.findMany({
        take: 5,

        orderBy: {
            createdAt: "desc",
        },

        select: {
            id: true,
            name: true,
            surname: true,
            sala: true,
            createdAt: true,
        },
    }); 

    //Top sedes
    const topBranches = await prisma.sede.findMany({
        include: {
            _count: {
                select: {
                    obituarios: true,
                },
            },
        },

        orderBy: {
            obituarios: {
                _count: "desc",
            },
        },

        take: 5,
    });

    return {
        summary: {
            totalObituaries,
            activeObituaries,
            finishedObituaries,
            archivedObituaries,
            totalCondolences,
            pendingCondolences,
            deliveredCondolences,
            archivedCondolences,
            totalBranches,
            activeBranches,
            totalScreens,
            onlineScreens,
            offlineScreens,
            maintenanceScreens,
            errorScreens,
            totalUsers,
            activeUsers,
        }, 
        latestObituaries,

        topBranches: topBranches.map((branch) => ({
            id: branch.id,
            nombre: branch.nombre,
            ciudad: branch.ciudad,
            departamento: branch.departamento,
            totalObituaries: branch._count.obituarios,
        })),
    };    
}