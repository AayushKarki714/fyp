import cors from "cors";
import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";
import authRouter from "./routes/auth.router";
import { Strategy } from "passport-google-oauth20";
import prisma from "./utils/prisma";
import workspaceRouter from "./routes/workspace.router";
import path from "path";
import galleryRouter from "./routes/gallery.router";
import progressRouter from "./routes/progress.router";
import verifyAuth from "./middlewares/verifyAuth.middlware";
import todoRouter from "./routes/todo.router";

const AUTH_OPTIONS = {
  clientID: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  callbackURL: "/auth/google/callback",
};

passport.use(new Strategy(AUTH_OPTIONS, verify));

function verify(_: string, __2: string, profile: object, cb: Function) {
  cb(null, profile);
}

passport.serializeUser(async (user: any, done) => {
  const exists = await prisma.user.findUnique({ where: { id: user.id } });
  if (!exists) {
    await prisma.user.create({
      data: {
        id: user.id,
        userName: user.displayName,
        email: user.emails[0].value,
        photo: user.photos[0].value,
      },
    });
  }
  done(null, user.id);
});

passport.deserializeUser(async (userId: string, done) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
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

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);
app.use(verifyAuth);
app.use("/workspace", workspaceRouter);
app.use("/gallery", galleryRouter);
app.use("/progress", progressRouter);
app.use("/todo", todoRouter);

export default app;
