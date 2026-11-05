const AUTH_COOKIE = 'token';

const defaultCookieSettings = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/'
};

const authCookieSettings = {
  ...defaultCookieSettings,
  maxAge: 24 * 60 * 60 * 1000
};

module.exports = {
  COOKIE_NAME: AUTH_COOKIE,
  AUTH_COOKIE,
  defaultCookieSettings,
  authCookieSettings,
  baseCookieOptions: defaultCookieSettings,
  cookieOptions: authCookieSettings
};
