const Member = require("../models/Member.model");

module.exports.roleVerify = (value) => {

  return async (req, res, next) => {
    const { role } = req.user;
    
    const member = await Member.countDocuments({
      _id: req.user.id,
      hidden: false,
    })

    if (role === value && member != 0)
      return next();
    else
      return res.sendStatus(401);
  }
}