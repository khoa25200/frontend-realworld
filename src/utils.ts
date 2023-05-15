const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const convertToDate = (datetime: number) => {
  const [year, month, day] = new Date(datetime)
    .toISOString()
    .split('T')[0]
    .split('-')
    .map(Number);
  return `${day} ${months[month - 1]}, ${year}`;
};
