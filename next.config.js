module.exports = {
  reactStrictMode: true, //development only
  env: {
    menuConfig: [
      { name: 'Dashboard', uri: '/', icon: 'chart-line' },
      { name: 'Groups', uri: '/groups', icon: 'users' },
      { name: 'Users', uri: '/users', icon: 'user' },
      { name: 'Environments', uri: '/dashboard2', icon: 'network-wired' },
      { name: 'Inventory', uri: '/dashboard3', icon: 'code' },
      { name: 'Issues', uri: '/dashboard4', icon: 'exclamation' },
      { name: 'Knowledge Base', uri: '/dashboard5', icon: 'university' }
    ]
  }
};
