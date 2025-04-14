# Brute-Force Challenge - Security Documentation

## Purpose
This application is designed to demonstrate:
- Cookie-based authentication vulnerabilities
- Brute-force attack vectors
- The importance of proper session management

## Intentionally Vulnerable Components

### 1. Stay-Logged-In Cookie
- **Format**: `base64(username:md5(password))`
- **Vulnerability**: 
  - Uses weak MD5 hashing
  - Contains raw password derivative
  - No proper signature validation

### 2. Session Management
- **Vulnerability**: 
  - Persistent cookies last 7 days
  - No rate limiting on login attempts
  - Session fixation possible

## Security Measures Implemented

### 1. Defense-in-Depth
- Proper session secret rotation
- Secure cookie flags (HttpOnly, SameSite)
- Environment-based security configurations

### 2. Monitoring
- Session store in MongoDB
- Proper error logging
- Database connection retries

## Educational Objectives

1. **For Students**:
   - Learn how to exploit weak cookie implementations
   - Understand brute-force attack mechanics
   - Practice ethical hacking techniques

2. **For Developers**:
   - Recognize dangerous authentication patterns
   - Learn secure session management
   - Understand defense strategies

## How To Exploit (Challenge Guide)

1. **Cookie Analysis**:
   ```javascript
   // Decode the cookie
   const cookie = 'base64string';
   const decoded = Buffer.from(cookie, 'base64').toString('utf-8');
   console.log(decoded); // "username:hash"