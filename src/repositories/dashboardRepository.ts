import { prisma } from "@/src/lib/prisma";
import { DashboardFiltersDTO } from "@/src/dto/dashboardFilters.dto";

export async function getDashboardMetrics(
    filters: DashboardFiltersDTO
) {
    //Filtros

    const dateFilter = filters.startDate || filters.endDate ? {
        createdAt: {
            ...(filters.startDate && {
                gte: new Date(`${filters.startDate}T00:00:00`),
            }),
            
            ...(filters.endDate && {
                lte: new Date(`${filters.endDate}T23:59:59.999`),
            }),
        },
    }
    : {};

    const obituaryWhere = {
        ...dateFilter,
        ...(filters.branchId && {
            sedeId: filters.branchId,
        }),
    };

    const condolenceWhere = {
        ...dateFilter,

        ...(filters.branchId && {
            obituario: {
                sedeId: filters.branchId,
            },
        }),
    };

    // Obituarios
    const [ 
        totalObituaries,
        activeObituaries,
        finishedObituaries,
        archivedObituaries,
    ] = await Promise.all([
        prisma.obituario.count({
            where: obituaryWhere,
        }),
        
        prisma.obituario.count({ 
            where: { 
                ...obituaryWhere,
                estado: "ACTIVO"},
        }),

        prisma.obituario.count({
            where: { 
                ...obituaryWhere,
                estado: "FINALIZADO"},
        }),

        prisma.obituario.count({
            where: { 
                ...obituaryWhere,
                estado: "ARCHIVADO"}
        }),
    ]);

    // Condolencias
    const [
        totalCondolences,
        pendingCondolences,
        deliveredCondolences,
        archivedCondolences,
    ] = await Promise.all([
        prisma.condolencia.count({
            where: condolenceWhere,
        }),

        prisma.condolencia.count({
            where: { 
                ...condolenceWhere,
                estado: "PENDIENTE"},
        }),

        prisma.condolencia.count({
            where: { 
                ...condolenceWhere,
                estado: "ENTREGADA"},
        }),

        prisma.condolencia.count({
            where: {
                ...condolenceWhere, 
                estado: "ARCHIVADA"},
        }),
    ]);

    // Estadisticas mensuales
    const monthlyStatisticsData = await prisma.obituario.findMany({
        where: obituaryWhere,

        select: {
            createdAt: true,
        },
    });

    const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
    ];

    const monthlyStatistics = months.map((month) => ({
        month,
        totalObituaries: 0,
    }));

    monthlyStatisticsData.forEach((item) => {
        const monthIndex = item.createdAt.getMonth();
        monthlyStatistics[monthIndex].totalObituaries++;
    });

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
        where: obituaryWhere,

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
    const topBranchesData = await prisma.sede.findMany({
        where: filters.branchId ? { id: filters.branchId } : undefined,
        
        select: {
            id: true,
            nombre: true,
            ciudad: true,
            departamento: true,

            obituarios: {
                where: {...dateFilter},
            
                select: { id: true },
            },
        },
    });

    const topBranches = topBranchesData
        .map((branch) => ({
            id: branch.id,
            nombre: branch.nombre,
            ciudad: branch.ciudad,
            departamento: branch.departamento,
            totalObituaries: branch.obituarios.length,
        }))
        .sort(
            (a, b) =>
                b.totalObituaries - a.totalObituaries
        )
        .slice(0, 5);

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

        topBranches,

        monthlyStatistics,
    };    
}