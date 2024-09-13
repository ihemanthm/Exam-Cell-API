import { UserServices } from "../services/index";
import { Request, Response } from "express";

const userController = {
  async singUp(req: Request, res: Response) {
    try {
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };
      const response = await UserServices.singUp(data);
      if (response == null) {
        return res.status(409).json({ message: "user already exists" });
      }
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async login(req: Request, res: Response) {
    try {
      const user =await UserServices.getUserByEmail(req.body.email);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      const token = await UserServices.login( user,req.body.password);
      if (!token) {
        return res.status(401).json({ message: "invalid credentials" });
      }
      return res.status(200).json({ token, user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({"message":"something went wrong"});
    }
  },
};

export default userController;
