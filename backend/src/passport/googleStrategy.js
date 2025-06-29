const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/User')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},async(accesToken,refreshToken,profile,done)=>{
    try {
        let user = await User.findOne({oauthId:profile.id,authProvider:'google'})
        if(!user){
            user=await User.create({
                 name: profile.displayName,
        email: profile.emails[0].value,
        oauthId: profile.id,
        authProvider: 'google',
        isVerified: true,
        hasPassword: false,
            })
        }
         return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}
))
module.exports = passport;