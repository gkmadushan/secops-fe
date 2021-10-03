module.exports = {
  reactStrictMode: true, //development only
  env: {
    menuConfig: [
      { name: 'Dashboard', uri: '/', icon: 'chart-line' },
      { name: 'Groups', uri: '/groups', icon: 'users' },
      { name: 'Users', uri: '/users', icon: 'user' },
      { name: 'Environments', uri: '/environments', icon: 'network-wired' },
      { name: 'Inventory', uri: '/dashboard3', icon: 'code' },
      { name: 'Issues', uri: '/dashboard4', icon: 'exclamation' },
      { name: 'Knowledge Base', uri: '/dashboard5', icon: 'university' }
    ],
    API_URL: 'http://localhost:8001',
    BASE_URL: 'http://localhost:3000'
  }
};
