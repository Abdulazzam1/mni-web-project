import api from './api';

export const getMetrics    = ()     => api.get('/admin/dashboard/metrics');
export const getTrend      = ()     => api.get('/admin/dashboard/trend');
export const getRecentRFQ  = ()     => api.get('/admin/dashboard/recent-rfq');
