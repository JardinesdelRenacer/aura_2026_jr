import { useEffect, useState } from "react";
import { DashboardReportDTO } from "@/src/dto/dashboardReport.dto";
import { getDashboard } from "@/src/api/dashboardApi";

export function useDashboard() {
    const [dashboard, setDashboard] = useState<DashboardReportDTO | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            setLoading(true);

            const data = await getDashboard();

            setDashboard(data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }
    return {
        dashboard,
        loading,
        error,
        reload: loadDashboard,
    };
}