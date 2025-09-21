const development = {
  apiUrl: "http:/localhost:3000",
  env: "development"
};

const production = {
  apiUrl: import.meta.env.VITE_API_URL || window.location.origin,
  env: "production"
};

const environment = import.meta.env.PROD ? production : development;

export default environment;
