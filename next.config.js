module.exports = {
  reactStrictMode: true, //development only
  env: {
    menuConfig: [
      { name: "Dashboard", uri: "/", icon: "chart-line" },
      { name: "Groups", uri: "/groups", icon: "users" },
      { name: "Users", uri: "/users", icon: "user" },
      { name: "Environments", uri: "/environments", icon: "network-wired" },
      { name: "Resources", uri: "/environments/resources", icon: "server" },
      { name: "Inventory", uri: "/inventory", icon: "code" },
      { name: "Issues", uri: "/issues", icon: "exclamation" },
      { name: "Knowledge Base", uri: "/kb", icon: "university" },
    ],
    API_URL: "http://localhost:8088/experience-service",
    BASE_URL: "http://localhost:8080",
    LIMIT: 10,
  },
};
