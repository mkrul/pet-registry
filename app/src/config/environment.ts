interface Environment {
  apiUrl: string;
  env: string;
}

const development: Environment = {
  apiUrl: "http:/localhost:3000",
  env: "development"
};

const production: Environment = {
  apiUrl: import.meta.env.VITE_API_URL || window.location.origin,
  env: "production"
};

const environment = import.meta.env.PROD ? production : development;

export default environment;
