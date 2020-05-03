
/**
 * Dependencies
 */
var pw = require('credential')();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Models
 */
var User = reqlib('/models/user');

/**
 * Passport Setup
 */
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err || !user) return done(err, null);
    done(null, user);
  });
});

module.exports = function(app, options) {
  if (!options.successRedirect) options.successRedirect = '/success';
  if (!options.failureRedirect) options.failureRedirect = '/error';
  return {
    init: function() {
      passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({
            username: username
          }, (err, user) => {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false, {
                message: 'User not found.'
              });
            }
            pw.verify(user.hash, password, (err, isValid) => {
              if (err) {
                return done(err);
              }
              if (!isValid) {
                return done(null, false, {
                  message: 'Password not valid.'
                });
              }
              return done(null, user);
            });
          });
        }
      ));
      app.use(passport.initialize());
      app.use(passport.session());
    },
    registerRoutes: function() {
      /**
       * Login
       */
      app.post('/login',
        passport.authenticate('local', {
          failureRedirect: options.failureRedirect
        }),
        function(req, res) {
          res.redirect(options.successRedirect);
        }
      );
      /**
       * Signup
       */
      app.post('/signup', (req, res) => {
        pw.hash(req.body.password, async (err, hash) => {
          if (err) {
            throw err;
          }
          var user = new User({
            username: req.body.username,
            hash: hash
          });
          try {
            var newUser = await user.save();
            res.status(201).json(newUser);
          } catch (err) {
            res.status(400).json({
              message: err.message
            })
          }
        });
      });
    },
  };
};
