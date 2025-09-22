const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  })}, ${date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  })}`;
};

export default formatDate;
