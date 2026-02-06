export interface Launch {
    id: number;
    name: string;
    provider: string;
    date: string;
    status: string;
}

export interface Asteroid {
    id: number;
    name: string;
    size: number;
    distance: number;
    danger: boolean;
}

export interface Satellite {
    id: number;
    name: string;
    orbitData: string;
}

export interface DashboardSummary {
    launchCount: number;
    asteroidCount: number;
    satelliteCount: number;
}
