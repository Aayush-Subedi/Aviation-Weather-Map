export const getFormmatedTime = (time) => {
  const year = time.getFullYear(); // returns a four-digit year
  const month = time.getMonth(); // returns the zero-based month index (0 = January)
  const day = time.getDate();
  const hour = time.getHours();
  const utcDate = new Date(Date.UTC(year, month, day, hour, 0, 0));
  return utcDate.toISOString();
};
