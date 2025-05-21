export const isTerminValid = ({ datum, status }) =>
  !(status === 'scheduled' && new Date(datum) < new Date());
