require('dotenv').config();
const { google } = require('googleapis');

function makeGmailClient(clientId, clientSecret, refreshToken) {
  const auth = new google.auth.OAuth2(clientId, clientSecret, 'http://127.0.0.1:8080');
  auth.setCredentials({ refresh_token: refreshToken });
  return google.gmail({ version: 'v1', auth });
}

function getClients() {
  return {
    primary: {
      label:  'John',
      email:  process.env.JOHN_EMAIL,
      gmail:  makeGmailClient(
        process.env.GMAIL_CLIENT_ID_PRIMARY,
        process.env.GMAIL_CLIENT_SECRET_PRIMARY,
        process.env.GMAIL_REFRESH_TOKEN_PRIMARY
      )
    },
    christy: {
      label:  'Christy',
      email:  process.env.CHRISTINA_EMAIL,
      gmail:  makeGmailClient(
        process.env.GMAIL_CLIENT_ID_CHRISTY,
        process.env.GMAIL_CLIENT_SECRET_CHRISTY,
        process.env.GMAIL_REFRESH_TOKEN_CHRISTY
      )
    }
  };
}

module.exports = { getClients };
