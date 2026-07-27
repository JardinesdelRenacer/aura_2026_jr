import jsPDF from "jspdf";
import { DashboardReportDTO } from "@/src/dto/dashboardReport.dto";

export function exportDashboardpdf (dashboard: DashboardReportDTO) {
    const doc = new jsPDF();

    const { summary, topBranches, latestObituaries } = dashboard;

    let y = 20;

    //Titulo
    doc.setFontSize(20);
    doc.text("Aura Touch", 20, y);

    y += 12;

    doc.setFontSize(11);

    latestObituaries.forEach((obituary) => {
        doc.text(
            `${obituary.name} ${obituary.surname} - ${obituary.sala}`,
            25,
            y
        );

        y += 8;
    });

    // Descargar
    doc.save(
        `reporte-aura-touch-${new Date().toISOString().split("T")[0]}.pdf`
    );
}