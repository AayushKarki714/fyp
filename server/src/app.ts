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
import {
  globalErrorHandler,
  isOperationalError,
  logError,
} from "./utils/errorHandler";
import notificationRouter from "./routes/notification.router";
import chatRouter from "./routes/chat.router";
import systemAdminRouter from "./routes/system-admin.router";
import statisticsRouter from "./routes/statistics.router";

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
    const createdUser = await prisma.user.create({
      data: {
        id: user.id,
        userName: user.displayName,
        email: user.emails[0].value,
        photo: user.photos[0].value,
      },
    });
    await prisma.notification.create({
      data: {
        recieverId: createdUser.id,
        message: `Welcome to Project Zone, ${createdUser.userName}`,
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

app.set("trust proxy", 1);
// for parsing json
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
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
app.use("/system-admin", systemAdminRouter);
app.use("/auth", authRouter);
app.use(verifyAuth);
app.use("/notification", notificationRouter);
app.use("/statistics", statisticsRouter);
app.use("/workspace", workspaceRouter);
app.use("/chat", chatRouter);
app.use("/gallery", galleryRouter);
app.use("/progress", progressRouter);
app.use("/todo", todoRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use(globalErrorHandler);

process.on("unhandledRejection", (error: Error) => {
  throw error;
});

process.on("uncaughtException", (error: Error) => {
  logError(error);
  if (!isOperationalError(error)) {
    process.exit(1);
  }
});

export default app;
