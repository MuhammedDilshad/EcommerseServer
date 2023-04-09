import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWTTOKEN;
const authMiddleWare = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ");

      if (token[0] == "Bearer" && token[1]) {
        const decoded = JWT.verify(token[1], secret);

        req.body._id = decoded?.id;
        next();
      } else {
        return res.status(400).send({ Message: " Invalid Token" });
      }
    } else {
      return res.status(400).send({ Message: "Token missing" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({ Message: "Unauthorized Request" });
  }
};

export default authMiddleWare;
