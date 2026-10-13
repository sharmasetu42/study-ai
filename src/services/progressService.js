// ============================================================
//  src/services/progressService.js
//  Fetches aggregated progress stats from the backend.
// ============================================================

import api from './api';

export const getProgress = async () => {
  const { data } = await api.get('/progress');
  return data.data;
};
