const getBaseUrl = (): string => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  if (process.env.NODE_ENV === "production") {
    return `${protocol}//${hostname}/api`;
  }

  // Development - use port 3000 for Rails API
  return `${protocol}//${hostname}:3000/api`;
};

export const apiConfig = {
  baseUrl: getBaseUrl()
};
