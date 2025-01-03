export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short"
  });
};

export const isRecentlyUpdated = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const threeDaysAgo = new Date(now.setDate(now.getDate() - 3));
  return date > threeDaysAgo;
};
