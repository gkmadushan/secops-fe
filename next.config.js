module.exports = {
  reactStrictMode: true, //development only
  env: {
    menuConfig: [
      {
        name: "Dashboard",
        uri: "/",
        icon: "chart-line",
        role: ["ADMIN", "SECOPS", "DEVOPS", "MANAGER"],
      },
      { name: "Groups", uri: "/groups", icon: "users", role: ["ADMIN"] },
      { name: "Users", uri: "/users", icon: "user", role: ["ADMIN"] },
      {
        name: "Environments",
        uri: "/environments",
        icon: "network-wired",
        role: ["SECOPS", "DEVOPS", "MANAGER"],
      },
      {
        name: "Resources",
        uri: "/environments/resources",
        icon: "server",
        role: ["SECOPS", "DEVOPS", "MANAGER"],
      },
      {
        name: "Scans",
        uri: "/environments/scans",
        icon: "server",
        role: ["SECOPS", "DEVOPS", "MANAGER"],
      },
      {
        name: "Inventory",
        uri: "/inventory",
        icon: "code",
        role: ["ADMIN", "SECOPS", "DEVOPS", "MANAGER"],
      },
      {
        name: "Issues",
        uri: "/issues",
        icon: "exclamation",
        role: ["SECOPS", "DEVOPS", "MANAGER"],
      },
      {
        name: "Knowledge Base",
        uri: "/kb",
        icon: "university",
        role: ["SECOPS", "DEVOPS", "MANAGER"],
      },
    ],
    API_URL: "http://localhost:8088/experience-service",
    BASE_URL: "http://localhost:8089",
    LIMIT: 10,
  },
};
