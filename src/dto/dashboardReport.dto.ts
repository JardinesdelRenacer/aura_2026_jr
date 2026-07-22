// export interface DashboardReportDTO {
export interface DashboardSummaryDTO {    
    totalObituaries: number;
    activeObituaries: number;
    finishedObituaries: number;
    archivedObituaries: number;

    totalCondolences: number;
    pendingCondolences: number;
    deliveredCondolences: number;
    archivedCondolences: number;

    totalBranches: number;
    activeBranches: number;

    totalScreens: number;
    onlineScreens: number;
    offlineScreens: number;
    maintenanceScreens: number;
    errorScreens: number;

    totalUsers: number;
    activeUsers:number;

}

export interface LatestObituaryDTO {
    id: string;
    name: string;
    surname: string;
    sala: string;
    createdAt: Date;
}

export interface TopBranchDTO {
    id: string;
    nombre: string;
    ciudad: string;
    departamento: string;
    totalObituaries: number;
}

export interface DashboardReportDTO{
    summary: DashboardSummaryDTO;
    
    latestObituaries: LatestObituaryDTO[];

    topBranches: TopBranchDTO[];
}