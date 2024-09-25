import { UserServices } from "../services/index";
import { Request, Response } from "express";

const userController = {
  // Async function for sign-up
  async singUp(req: Request, res: Response) {
    try {
      // store the credentials
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      // request signUP function from UserServices file
      const response = await UserServices.singUp(data);

      //check for duplicate entry
      if (response == null) {
        return res.status(409).json({ message: "user already exists" });
      }

      res.status(201).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //async function to handle login
  async login(req: Request, res: Response) {
    try {
      //fetch the uset BY mail
      const user =await UserServices.getUserByEmail(req.body.email);
      
      //check for user
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      //get the JWT
      const token = await UserServices.login( user,req.body.password);
      
      if (!token) {
        return res.status(401).json({ message: "invalid credentials" });
      }
      
      //send the response
      return res.status(200).json({ token, user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({"message":"something went wrong"});
    }
  },
};

export default userController;
