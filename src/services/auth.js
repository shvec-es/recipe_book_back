import crypto from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constans/time.js';
import { Session } from '../models/session.js';

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true, // браузер не дає доступу до куки з JS (через document.cookie). Зменшує ризик витоку токенів через XSS.
    secure: true, // браузер надсилає таку куку лише через HTTPS. У продакшні це must-have; у дев-режимі без HTTPS такі куки не приліпнуть.
    sameSite: 'none', // дозволяє надсилати куку у крос-доменних запитах (коли фронтенд і бекенд на різних доменах/порталах). Важливо: SameSite=None вимагає secure: true.
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY,
  });
};
