import { THRESHOLDS, COLORS } from './constants';

const STATUS_COLORS = {
  Good: COLORS.statusGood,
  Moderate: COLORS.statusModerate,
  Alert: COLORS.statusAlert
};

export const getEmissionStatus = (co, co2) => {
  if (co > THRESHOLDS.CO.moderate || co2 > THRESHOLDS.CO2.moderate) return 'Alert';
  if (co > THRESHOLDS.CO.good || co2 > THRESHOLDS.CO2.good) return 'Moderate';
  return 'Good';
};

export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || COLORS.primary;
};
