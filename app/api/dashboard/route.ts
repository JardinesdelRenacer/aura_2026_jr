import { NextRequest, NextResponse } from "next/server";
import { BusinessError } from "@/src/errors/BusinessError";
import { getDashboardReport } from "@/src/services/dashboardService";
import { DashboardFiltersDTO } from "@/src/dto/dashboardFilters.dto";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filters: DashboardFiltersDTO = {
            branchId: searchParams.get("branchId") || undefined,
            startDate: searchParams.get("startDate") || undefined,
            endDate: searchParams.get("endDate") || undefined,
        };

        const dashboard = await getDashboardReport(filters);
        
        return NextResponse.json({ success: true, data: dashboard });
    } catch (error) {
        console.error("Dashboard Error: ", error);

        if (error instanceof BusinessError) {
            return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode }
            );
        }
        console.error(error);
        return NextResponse.json({ success: false, message: "Error interno del servidor"}, { status: 500 });
    }
        
}