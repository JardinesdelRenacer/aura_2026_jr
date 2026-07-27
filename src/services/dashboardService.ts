import { DashboardReportDTO } from "@/src/dto/dashboardReport.dto";
import { getDashboardMetrics } from "@/src/repositories/dashboardRepository";
import { DashboardFiltersDTO } from "@/src/dto/dashboardFilters.dto";

export async function getDashboardReport(
    filters: DashboardFiltersDTO = {}
): Promise<DashboardReportDTO> {
    return await getDashboardMetrics(filters);
}