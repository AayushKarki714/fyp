import cors from "cors";
import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";
import authRouter from "./routes/auth.router";
import { Strategy } from "passport-google-oauth20";

const AUTH_OPTIONS = {
  clientID: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  callbackURL: "/auth/google/callback",
};

passport.use(new Strategy(AUTH_OPTIONS, verify));

function verify(_: string, __2: string, profile: object, cb: Function) {
  cb(null, profile);
}

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: object, done) => {
  done(null, user);
});

const app = express();

// for parsing json
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "cookie",
    keys: [process.env.COOKIE_KEY1!, process.env.COOKIE_KEY2!],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);

export default app;
