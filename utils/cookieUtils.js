// utils/cookieUtils.js
const md5 = require('md5');

const setVulnerableCookie = async (res, username, password) => {
  const cookieValue = Buffer.from(`${username}:${md5(password)}`).toString('base64');
  res.cookie('stay-logged-in', cookieValue, {
    httpOnly: true,
    maxAge: parseInt(process.env.PERSISTENT_SESSION_AGE, 10) || 604800000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });
};

const verifyVulnerableCookie = (cookie, initialUsers) => {
  try {
    const decoded = Buffer.from(cookie, 'base64').toString('utf-8');
    const [username, hash] = decoded.split(':');
    if (!username || !hash) {
      console.log('Malformed cookie: missing username or hash');
      return null;
    }
    const addedUser = initialUsers.find((u) => u.username === username);
    if (!addedUser) {
      console.log(`Cookie verification failed: '${username}' not in initialUsers`);
      return null;
    }
    const expectedHash = md5(addedUser.password);
    if (hash === expectedHash) {
      return username;
    }
    console.log(`Cookie verification failed: Invalid hash for '${username}'`);
    return null;
  } catch (err) {
    console.error('Invalid cookie format:', err.message);
    return null;
  }
};

module.exports = { setVulnerableCookie, verifyVulnerableCookie };