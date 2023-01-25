import modUser from "#models/user.js";

import ForbiddenError from "#error/ForbiddenError.js";

const checkLogin = async (req, res, next) => {
  if (!req?.user || !(await modUser.exists({ _id: req.user.id }))) {
    throw new ForbiddenError("Not Authorized User", {
      originalUrl: req.originalUrl,
    });
  }

  next();
};

const checkNotLogin = (req, res, next) => {
  if (req?.user) {
    res.redirect(`${process.env.PROTOCOL}://${process.env.CLIENT_HOST}/main`);
    return;
  }
  next();
};

export default { checkLogin, checkNotLogin };