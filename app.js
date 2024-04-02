import connectToDatabase from './database/connection.js';
import session from 'express-session';
import passport from 'passport';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import userdb from './model/userSchema.js';
import cookieParser from 'cookie-parser';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
dotenv.config();
const app = express();
app.use(cookieParser());
const port =3000;
 

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(session({
  secret: 'your-secret-key', 
  resave: false, // Prevents session from being saved to the session store on every request
  saveUninitialized: false, // Prevents saving uninitialized sessions
  cookie: { 
    secure: false, // Set to true if your app is running behind HTTPS
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    maxAge: 3600000 // Session cookie will expire after 1 hour (in milliseconds)
  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy({
      clientID:process.env.Client_ID,
      clientSecret: process.env.Client_secret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"]
  },
  async (accessToken, refreshToken, profile,done) => {
      try {
          let user = await userdb.findOne({ googleId: profile.id });

          if (!user) {
              user = new userdb({
                  googleId: profile.id,
                  displayName: profile.displayName,
                  email: profile.emails[0].value,
                  image: profile.photos[0].value
              });

              await user.save();
          }

          return done(null, user)
      } catch (error) {
          return done(error, null)
      }
  }
  )
)

passport.serializeUser((user,done)=>{
  done(null,user);
})

passport.deserializeUser((user,done)=>{
  done(null,user);
});



app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:5173/dash",
    failureRedirect:"http://localhost:5173/login"
}))
app.get("/login/sucess",async(req,res)=>{

  if(req.user){
      res.status(200).json({message:"user Login",user:req.user})
  }else{
      res.status(400).json({message:"Not Authorized"})
  }
})


app.get("/logout",(req,res,next)=>{
  req.logout(function(err){
      if(err){return next(err)}
      res.redirect("http://localhost:3000");
  })
})


connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});

 
