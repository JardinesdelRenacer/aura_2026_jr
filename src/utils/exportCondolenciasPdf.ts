import { jsPDF } from "jspdf";

interface CondolenciaPdf {
    id: string;
    codigo?: string | null;
    fullName: string;
    phone: string;
    message: string;
    estado: string;
    createdAt: string;
}

interface ReporteCondolenciasPdf {
    id: string;
    name: string;
    surname: string;
    sala: string;
    estado: string;

    sede: {
        nombre: string;
        ciudad: string;
        departamento: string;
    };

    condolencias: CondolenciaPdf[];
}

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const TEMPLATE_PATHS = {
    portada: "/pdf/condolencias/portada.png",
    oracion: "/pdf/condolencias/oracion.png",
    condolencia: "/pdf/condolencias/condolencia.png",
};

function limpiarNombreArchivo(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
}

function nombreCompleto(reporte: ReporteCondolenciasPdf) {
    return [reporte.name, reporte.surname]
        .filter(Boolean)
        .join(" ")
        .trim();
}

function nombreSala(sala: string) {
    if (sala === "VIP") {
        return "Sala VIP";
    }

    return sala.replace("_", " ");
}

async function cargarImagenComoDataUrl(
    src: string
): Promise<string> {
    const response = await fetch(src);

    if (!response.ok) {
        throw new Error(
            `No fue posible cargar la plantilla ${src}`
        );
    }

    const blob = await response.blob();

    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
                return;
            }

            reject(
                new Error(
                    `No fue posible convertir la plantilla ${src}`
                )
            );
        };

        reader.onerror = () => {
            reject(
                new Error(
                    `Error leyendo la plantilla ${src}`
                )
            );
        };

        reader.readAsDataURL(blob);
    });
}

function agregarFondo(
    doc: jsPDF,
    imagen: string
) {
    doc.addImage(
        imagen,
        "PNG",
        0,
        0,
        PAGE_WIDTH,
        PAGE_HEIGHT
    );
}

function dibujarTextoCentrado({
    doc,
    texto,
    y,
    fontSize,
    maxWidth,
    color = [7, 32, 78],
    fontStyle = "normal",
}: {
    doc: jsPDF;
    texto: string;
    y: number;
    fontSize: number;
    maxWidth: number;
    color?: [number, number, number];
    fontStyle?: "normal" | "bold" | "italic";
}) {
    doc.setFont("times", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);

    const lineas = doc.splitTextToSize(
        texto,
        maxWidth
    );

    doc.text(
        lineas,
        PAGE_WIDTH / 2,
        y,
        {
            align: "center",
        }
    );

    return lineas.length;
}

function agregarPortada(
    doc: jsPDF,
    reporte: ReporteCondolenciasPdf,
    portada: string
) {
    agregarFondo(doc, portada);

    const nombre = nombreCompleto(reporte);

    dibujarTextoCentrado({
        doc,
        texto: nombre,
        y: 205,
        fontSize: nombre.length > 28 ? 25 : 31,
        maxWidth: 165,
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(45, 65, 100);

    doc.text(
        `${reporte.sede.nombre} - ${nombreSala(
            reporte.sala
        )}`,
        PAGE_WIDTH / 2,
        241,
        {
            align: "center",
        }
    );
}

function agregarOracion(
    doc: jsPDF,
    oracion: string
) {
    doc.addPage();
    agregarFondo(doc, oracion);
}

function agregarCondolencia({
    doc,
    condolencia,
    index,
    fondo,
}: {
    doc: jsPDF;
    condolencia: CondolenciaPdf;
    index: number;
    fondo: string;
}) {
    doc.addPage();

    agregarFondo(doc, fondo);

    const layout = {
        // Encabezado
        asistentesY: 35,

        // Datos del asistente
        labelNombreX: 41,
        valorNombreX: 76,
        nombreY: 56,
        nombreWidth: 110,

        labelTelefonoX: 41,
        valorTelefonoX: 78,

        // Dedicatoria
        dedicatoriaTitleYGap: 24,
        mensajeYGap: 12,

        mensajeX: PAGE_WIDTH / 2,
        mensajeWidth: 145,

        // Pie de página
        footerY: 276,
    };

    doc.setTextColor(45, 87, 150);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(20);

    doc.text(
        "Asistentes:",
        PAGE_WIDTH / 2,
        layout.asistentesY,
        {
            align: "center",
        }
    );

    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");

    doc.text(
        "Nombre:",
        layout.labelNombreX,
        layout.nombreY
    );

    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);

    const nombreLineas = doc.splitTextToSize(
        condolencia.fullName,
        layout.nombreWidth
    );

    doc.text(
        nombreLineas,
        layout.valorNombreX,
        layout.nombreY
    );

    const alturaNombre =
        Math.max(nombreLineas.length, 1) * 7;

    const telefonoY =
        layout.nombreY + alturaNombre + 10;

    doc.setTextColor(45, 87, 150);
    doc.setFont("helvetica", "italic");

    doc.text(
        "Teléfono:",
        layout.labelTelefonoX,
        telefonoY
    );

    doc.setFont("helvetica", "normal");
    doc.setTextColor(20, 20, 20);

    doc.text(
        condolencia.phone || "No registrado",
        layout.valorTelefonoX,
        telefonoY
    );

    const dedicatoriaY =
        telefonoY + layout.dedicatoriaTitleYGap;

    doc.setFont("helvetica", "italic");
    doc.setTextColor(45, 87, 150);
    doc.setFontSize(18);

    doc.text(
        "Dedicatoria:",
        PAGE_WIDTH / 2,
        dedicatoriaY,
        {
            align: "center",
        }
    );

    const mensajeY =
        dedicatoriaY + layout.mensajeYGap;

    doc.setFont("helvetica", "italic");
    doc.setTextColor(20, 20, 20);

    const mensajeEsLargo =
        condolencia.message.length > 450;

    const fontSizeMensaje =
        mensajeEsLargo ? 12 : 14;

    const lineHeightFactor =
        mensajeEsLargo ? 1.35 : 1.42;

    doc.setFontSize(fontSizeMensaje);

    const mensajeLineas = doc.splitTextToSize(
        condolencia.message,
        layout.mensajeWidth
    );

    doc.text(
        mensajeLineas,
        layout.mensajeX,
        mensajeY,
        {
            align: "center",
            lineHeightFactor,
        }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);

    doc.text(
        `Mensaje ${index + 1} - ${new Date(
            condolencia.createdAt
        ).toLocaleString("es-CO")}`,
        PAGE_WIDTH / 2,
        layout.footerY,
        {
            align: "center",
        }
    );
}

// -----
// function agregarCondolencia({
//     doc,
//     condolencia,
//     index,
//     fondo,
// }: {
//     doc: jsPDF;
//     condolencia: CondolenciaPdf;
//     index: number;
//     fondo: string;
// }) {
//     doc.addPage();

//     agregarFondo(doc, fondo);

//     // 21 168
//     const cardLeft = 41;
//     const contentWidth = 168;

//     doc.setTextColor(45, 87, 150);

//     doc.setFont("helvetica", "italic");
//     doc.setFontSize(20);

//     doc.text(
//         "Asistentes:",
//         PAGE_WIDTH / 2,
//         35,
//         {
//             align: "center",
//         }
//     );

//     doc.setFontSize(14);
//     doc.setFont("helvetica", "italic");

//     doc.text(
//         "Nombre:",
//         cardLeft,
//         56
//     );

//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(20, 20, 20);

//     const nombreLineas = doc.splitTextToSize(
//         condolencia.fullName,
//         125
//     );

//     doc.text(
//         nombreLineas,
//         cardLeft + 35,
//         56
//     );

//     const alturaNombre =
//         Math.max(nombreLineas.length, 1) * 7;

//     // 56 + 10
//     const telefonoY = 56 + alturaNombre + 10;

//     doc.setTextColor(45, 87, 150);
//     doc.setFont("helvetica", "italic");

//     doc.text(
//         "Teléfono:",
//         cardLeft,
//         telefonoY
//     );

//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(20, 20, 20);

//     doc.text(
//         condolencia.phone || "No registrado",
//         cardLeft + 37,
//         telefonoY
//     );

//     const dedicatoriaY = telefonoY + 24;

//     doc.setFont("helvetica", "italic");
//     doc.setTextColor(45, 87, 150);
//     doc.setFontSize(18);

//     doc.text(
//         "Dedicatoria:",
//         PAGE_WIDTH / 2,
//         dedicatoriaY,
//         {
//             align: "center",
//         }
//     );

//     const mensajeY = dedicatoriaY + 12;

//     doc.setFont("helvetica", "italic");
//     doc.setTextColor(20, 20, 20);
//     doc.setFontSize(14);

//     const mensajeLineas = doc.splitTextToSize(
//         condolencia.message,
//         contentWidth
//     );

//     /*
//      * La página está diseñada para una condolencia.
//      * Si el mensaje es muy largo, reducimos ligeramente
//      * el tamaño de la fuente.
//      */
//     if (mensajeLineas.length > 20) {
//         doc.setFontSize(12);

//         const lineasReducidas =
//             doc.splitTextToSize(
//                 condolencia.message,
//                 contentWidth
//             );

//         doc.text(
//             lineasReducidas,
//             cardLeft,
//             mensajeY,
//             {
//                 lineHeightFactor: 1.35,
//             }
//         );
//     } else {
//         doc.text(
//             mensajeLineas,
//             cardLeft,
//             mensajeY,
//             {
//                 lineHeightFactor: 1.42,
//             }
//         );
//     }

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(8);
//     doc.setTextColor(100, 116, 139);

//     doc.text(
//         `Mensaje ${index + 1} - ${new Date(
//             condolencia.createdAt
//         ).toLocaleString("es-CO")}`,
//         PAGE_WIDTH / 2,
//         276,
//         {
//             align: "center",
//         }
//     );
// }
// -----
function agregarPaginaSinCondolencias(
    doc: jsPDF,
    fondo: string
) {
    doc.addPage();
    agregarFondo(doc, fondo);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(18);
    doc.setTextColor(45, 87, 150);

    doc.text(
        "Condolencias",
        PAGE_WIDTH / 2,
        60,
        {
            align: "center",
        }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(100, 116, 139);

    doc.text(
        "Aún no se han registrado mensajes para este servicio.",
        PAGE_WIDTH / 2,
        110,
        {
            align: "center",
            maxWidth: 150,
        }
    );
}

function agregarNumeracion(doc: jsPDF) {
    const totalPaginas = doc.getNumberOfPages();

    for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina++
    ) {
        /*
         * No numeramos la portada.
         */
        if (pagina === 1) {
            continue;
        }

        doc.setPage(pagina);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(125, 145, 175);

        doc.text(
            `${pagina - 1}`,
            PAGE_WIDTH / 2,
            289,
            {
                align: "center",
            }
        );
    }
}

export async function exportCondolenciasPdf(
    reporte: ReporteCondolenciasPdf
) {
    const [
        plantillaPortada,
        plantillaOracion,
        plantillaCondolencia,
    ] = await Promise.all([
        cargarImagenComoDataUrl(
            TEMPLATE_PATHS.portada
        ),
        cargarImagenComoDataUrl(
            TEMPLATE_PATHS.oracion
        ),
        cargarImagenComoDataUrl(
            TEMPLATE_PATHS.condolencia
        ),
    ]);

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
    });

    agregarPortada(
        doc,
        reporte,
        plantillaPortada
    );

    agregarOracion(
        doc,
        plantillaOracion
    );

    if (reporte.condolencias.length === 0) {
        agregarPaginaSinCondolencias(
            doc,
            plantillaCondolencia
        );
    } else {
        reporte.condolencias.forEach(
            (condolencia, index) => {
                agregarCondolencia({
                    doc,
                    condolencia,
                    index,
                    fondo:
                        plantillaCondolencia,
                });
            }
        );
    }

    agregarNumeracion(doc);

    const nombre = nombreCompleto(reporte);

    const nombreArchivo = limpiarNombreArchivo(
        `Libro_de_Condolencias_${nombre}_${reporte.sede.nombre}`
    );

    doc.save(`${nombreArchivo}.pdf`);
}