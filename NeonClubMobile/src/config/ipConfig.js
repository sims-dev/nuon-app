// Centralized configuration for IP address
// This will work on any network by trying common development IPs

const getIPAddress = () => {
  // For mobile app, always use the configured IP address
  return '192.168.0.209';
};

const IP_ADDRESS = getIPAddress();

console.log(`🔧 Mobile App using IP: ${IP_ADDRESS}`);

module.exports = {
  IP_ADDRESS,
};