import { DashboardReportDTO } from "@/src/dto/dashboardReport.dto";
import { DashboardFiltersDTO } from "@/src/dto/dashboardFilters.dto";

export async function getDashboard(
    filters?: DashboardFiltersDTO
): Promise<DashboardReportDTO> {
    const params = new URLSearchParams();

    if (filters?.branchId) {
        params.set("branchId", filters.branchId);
    }

    if (filters?.startDate) {
        params.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
        params.set("endDate", filters.endDate);
    }

    const query = params.toString();

    const url = query ? `/api/dashboard?${query}` : "/api/dashboard";

    const response = await fetch(url);

    const result = await response.json();

    if(!response.ok) {
        throw new Error(result.message || "No fue posible cargar el dashboard.");
    };
    
    return result.data;   
}