# TODO: Fix DigiLocker Redirect URI Mismatch

## Steps to Complete:
- [ ] Manually update .env file (editing .env via tools is not allowed):
  - Add DIGILOCKER_REDIRECT_URI=https://cms.ezwealth.in/api/ekyc/digilocker
  - Update DIGILOCKER_AUTH_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize
  - Update DIGILOCKER_TOKEN_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/1/token
  - Update DIGILOCKER_BASE_URL=https://digilocker.meripehchaan.gov.in/public/oauth2/1
- [x] Update controllers/kycController.js:
  - Replace hardcoded DigiLocker URLs with process.env variables
  - Use DIGILOCKER_AUTH_URL for login redirect
  - Use DIGILOCKER_TOKEN_URL for token exchange
  - Use DIGILOCKER_BASE_URL for user profile API
- [x] Test the digilocker login endpoint to ensure redirect_uri is correctly set
- [x] Fix PKCE implementation for proper code_verifier and code_challenge generation
- [x] Resolve redirect_uri mismatch: Use ngrok to tunnel localhost or register new DigiLocker client for development
- [x] Add express-session middleware for storing PKCE verifier
