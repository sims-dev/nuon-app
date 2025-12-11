// Centralized configuration for IP address
// This will work on any network by trying common development IPs

const getIPAddress = () => {
  // Always use localhost for web apps to connect to backend
  return 'localhost';
};

const IP_ADDRESS = getIPAddress();

console.log(`🎯 Mentor Dashboard using IP: ${IP_ADDRESS}`);

module.exports = {
  IP_ADDRESS,
};