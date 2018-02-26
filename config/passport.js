const LocalStrategy         =   require('passport-local').Strategy;

const User                  =   require('../models/user');

module.exports              =   (passport) => {
    // Serialize user for session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // Local signup strategy
    passport.use('local-signup',
        new LocalStrategy(
            {
                usernameField       :   'email',
                passwordField       :   'password',
                passReqToCallback   :   true    // Can pass entire request to callback
            },
            (req, email, password, done) => {
                process.nextTick(() => {
                    User.findOne({ "local.email" : email }, (err, user) => {
                        if (err) return done(err);
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
                        }
                        else {
                            var newUser             =   new User();
                            newUser.local.email     =   email;
                            newUser.local.password  =   newUser.generateHash(password);

                            newUser.save((err) => {
                                if (err) throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                });
            }
        )
    );

    // Local login strategy
    passport.use('local-login',
        new LocalStrategy(
            {
                usernameField       :   'email',
                passwordField       :   'password',
                passReqToCallback   :   true    // Can pass entire request to callback
            },
            (req, email, password, done) => {
                User.findOne({ 'local.email' : email }, (err, user) => {
                    if (err) return done(err);
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }

                    return done(null, user);
                });
            }
        )
    );
};