const getBaseUrl = (): string => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  if (process.env.NODE_ENV === "production") {
    return `${protocol}//${hostname}/api`;
  }

  return `${protocol}//${hostname}:3000/api`;
};

export const apiConfig = {
  baseUrl: getBaseUrl()
};
