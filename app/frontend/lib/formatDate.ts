// format date like '01/30/2024 12:00 AM'

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })}, ${date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })}`;
};

export default formatDate;
