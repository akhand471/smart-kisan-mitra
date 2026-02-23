import api from './api';

// GET /api/schemes?category=&state=&search=&featured=
export const getSchemes = async ({ category = '', state = '', search = '', featured = false } = {}) => {
    const params = {};
    if (category) params.category = category;
    if (state && state !== 'all') params.state = state;
    if (search) params.search = search;
    if (featured) params.featured = 'true';
    const { data } = await api.get('/schemes', { params });
    return data; // { count, categories, data[] }
};
