/**
 * Session Configuration
 * (sails.config.session)
 *
 * Sails session integration leans heavily on the great work already done by
 * Express, but also unifies Socket.io with the Connect session store. It uses
 * Connect's cookie parser to normalize configuration differences between Express
 * and Socket.io and hooks into Sails' middleware interpreter to allow you to access
 * and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://links.sailsjs.org/docs/config/session
 */

module.exports.session = {
  //secret: process.env.xtuple_session_secret || '00000000000000000000000000000000',
  secret: '6533f2d3ee51b0f4e9573c4850262c01',

  /*
  cookie: {
    maxAge: (process.env.xtuple_session_maxage || 7) * (24 * 60 * 60 * 1000)
  },
  */
};
