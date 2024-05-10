import jwt from 'jsonwebtoken'
import User from '../mvc/models/userSchema.js';

export const VerifyToken = async (req,res, next) => {
    try {
        // const headers = req.headers[`authorization`]
        // const token = headers.split(" ")[1];
        // console.log("🚀 ~ file: authentication.js:33 ~ token:", token);
        // if (!token) return res.status(404).json({ message: 'token not found', success: false, error: error.message });

        const cookie=req.headers.cookie;
        // console.log("🚀 ~ file: authentication.js:12 ~ cookie:", cookie);
        const getCookie=cookie?.split("=")[1];
        // console.log("🚀 ~ file: authentication.js:14 ~ getCookie:", getCookie);

        const decode = jwt.verify(getCookie, "test");
        // console.log("🚀 ~ file: authentication.js:37 ~ decode:", decode.commerceTwo);
        const user = await User.findOne({ _id: decode.commerceTwo });
        // console.log("🚀 ~ file: authentication.js:39 ~ user:", user);
        if (!user) return res.status(404).json({ message: 'user not found', success: false, error: error.message });
        // console.log(req.id)
        req.id = user._id
        // console.log("🚀 ~ file: authentication.js:43 ~  req.id:", req.id);

        next();

   } catch (error) {
    res.status(404).json({message:"Authorization token is required", success:false, error:error.message})

   }

}


export const getUser = async (req,res) => {
  try {
      const userId = req.id;
    //   console.log("🚀 ~ file: authentication.js:52 ~ userId:", userId);
      const user = await User.findOne(userId, "-password");
      res.status(200).json({ message: "user found successfully", success: true, user });

  } catch (error) {
      res.status(404).json({ message: "User not found", success: false, error: error.message })


  }

}