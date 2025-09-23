const ENVIRONMENT = {
  ALLOWED_ORIGINS:
    process.env.NODE_ENV === "dev"
      ? [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:8080",
          "http://localhost:5173",
        ]
      : (process.env.CLIENT_ORIGIN || "")
          .split(",")
          .map((origin) => origin.trim()), // ✅ split and trim
};

export default ENVIRONMENT;
