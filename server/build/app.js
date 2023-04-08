"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_1 = __importDefault(require("./utils/prisma"));
const workspace_router_1 = __importDefault(require("./routes/workspace.router"));
const path_1 = __importDefault(require("path"));
const gallery_router_1 = __importDefault(require("./routes/gallery.router"));
const progress_router_1 = __importDefault(require("./routes/progress.router"));
const verifyAuth_middlware_1 = __importDefault(require("./middlewares/verifyAuth.middlware"));
const todo_router_1 = __importDefault(require("./routes/todo.router"));
const errorHandler_1 = require("./utils/errorHandler");
const notification_router_1 = __importDefault(require("./routes/notification.router"));
const chat_router_1 = __importDefault(require("./routes/chat.router"));
const system_admin_router_1 = __importDefault(require("./routes/system-admin.router"));
const statistics_router_1 = __importDefault(require("./routes/statistics.router"));
const AUTH_OPTIONS = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
};
passport_1.default.use(new passport_google_oauth20_1.Strategy(AUTH_OPTIONS, verify));
function verify(_, __2, profile, cb) {
    cb(null, profile);
}
passport_1.default.serializeUser((user, done) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield prisma_1.default.user.findUnique({ where: { id: user.id } });
    if (!exists) {
        const createdUser = yield prisma_1.default.user.create({
            data: {
                id: user.id,
                userName: user.displayName,
                email: user.emails[0].value,
                photo: user.photos[0].value,
            },
        });
        yield prisma_1.default.notification.create({
            data: {
                recieverId: createdUser.id,
                message: `Welcome to Project Zone, ${createdUser.userName}`,
            },
        });
    }
    done(null, user.id);
}));
passport_1.default.deserializeUser((userId, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    done(null, user);
}));
const app = (0, express_1.default)();
// for parsing json
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use((0, cookie_session_1.default)({
    name: "cookie",
    keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
    maxAge: 24 * 60 * 60 * 1000,
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/system-admin", system_admin_router_1.default);
app.use("/auth", auth_router_1.default);
app.use(verifyAuth_middlware_1.default);
app.use("/notification", notification_router_1.default);
app.use("/statistics", statistics_router_1.default);
app.use("/workspace", workspace_router_1.default);
app.use("/chat", chat_router_1.default);
app.use("/gallery", gallery_router_1.default);
app.use("/progress", progress_router_1.default);
app.use("/todo", todo_router_1.default);
app.use(errorHandler_1.globalErrorHandler);
process.on("unhandledRejection", (error) => {
    throw error;
});
process.on("uncaughtException", (error) => {
    (0, errorHandler_1.logError)(error);
    if (!(0, errorHandler_1.isOperationalError)(error)) {
        process.exit(1);
    }
});
exports.default = app;
