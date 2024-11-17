import jwt from "jsonwebtoken";

export const generateJWT = () => {
  const data = {
    name: "Mario",
    creditCard: "789513545",
    password: "legio123"
  };

  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "6m"
  });

  return token;
};
