import { DashboardReportDTO } from "@/src/dto/dashboardReport.dto";
import { getDashboardMetrics } from "@/src/repositories/dashboardRepository";


export async function getDashboardReport(): Promise<DashboardReportDTO> {
    return await getDashboardMetrics();
    
}