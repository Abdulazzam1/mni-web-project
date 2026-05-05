// FE/src/services/portfolioService.js
// FIX: getPortfolioBySlug menggunakan template literal yang benar (backtick)

import api from './api';

export const getPortfolios      = (params = {}) => api.get('/portfolio', { params });
export const getPortfolioBySlug = (slug)        => api.get(`/portfolio/${slug}`);