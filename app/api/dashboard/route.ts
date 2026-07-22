import { NextResponse } from "next/server";
import { BusinessError } from "@/src/errors/BusinessError";
import { getDashboardReport } from "@/src/services/dashboardService";

export async function GET() {
    try {
        const dashboard = await getDashboardReport();

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