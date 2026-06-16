const salas = await prisma.sala.findMany({
    where:{
        sedeId:params.id
    },
    orderBy:{
        nombre:"asc"
    }
})