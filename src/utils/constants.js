export const THRESHOLDS = {
  CO: { good: 35, moderate: 70 },
  CO2: { good: 600, moderate: 900 }
};

export const COLORS = {
  primary: '#0073BB',
  statusGood: '#00A86B',
  statusModerate: '#FF8C00',
  statusAlert: '#E53935',
  background: '#F5F7FA',
  text: '#333333'
};

export const STATUS_COLORS = {
  Good: COLORS.statusGood,
  Moderate: COLORS.statusModerate,
  Alert: COLORS.statusAlert
};
