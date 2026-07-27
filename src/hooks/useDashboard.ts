import { useCallback, useEffect, useState } from "react";
import { DashboardReportDTO } from "@/src/dto/dashboardReport.dto";
import { DashboardFiltersDTO } from "../dto/dashboardFilters.dto";
import { getDashboard } from "@/src/api/dashboardApi";

export function useDashboard() {
    const [dashboard, setDashboard] = useState<DashboardReportDTO | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const loadDashboard = useCallback(
        async (filters?: DashboardFiltersDTO) => {
            try {
                setLoading(true);
                setError("");

                const data = await getDashboard(filters);

                setDashboard(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError (error.message);
                } else {
                    setError("Ocurrió un error al cargar el dashboard. ");
                }
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        loadDashboard();
    }, []);
    
    return {
        dashboard,
        loading,
        error,
        reload: loadDashboard,
    };
}