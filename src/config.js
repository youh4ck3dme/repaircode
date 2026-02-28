// Configuration for API endpoints
export const API_CONFIG = {
    // Use environment variable for API URL, fallback to localhost for development
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',

    // API endpoints
    ANALYZE: '/api/analyze',
    FIXES: '/api/fixes',
    PATCH: '/api/patch',
    STATUS: '/api/status',
    DOWNLOAD: '/api/download',
    EVENTS: '/events'
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to build event source URLs
export const buildEventUrl = (jobId) => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.EVENTS}/${jobId}`;
};