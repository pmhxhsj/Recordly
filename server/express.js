import express from "express";
import bodyParser from "body-parser";
import connectRedis from "connect-redis";
const redisStore = connectRedis(session);
import http from "http";
import session from "express-session";

import initOAuth from "./oauth.js";
import routers from "./routes/index.js";

export default function initExpress(redisClient) {
  const app = express();
  const PORT = 8080;

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(
    session({
      key: "app.sid",
      secret: "session-secret",
      store: new redisStore({
        port: 6379,
        client: redisClient,
        prefix: "session:",
        db: 0,
      }),
      resave: false,
      saveUninitialized: true,
      cookie: { path: "/", maxAge: 1800000 },
    })
  );

  app.use("/api", routers);

  app.get("/", (req, res, next) => {
    res.send("hello world!");
  });

  initOAuth(app);

  return http.createServer(app).listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
  });
}