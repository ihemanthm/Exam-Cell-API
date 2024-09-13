import { UserRepository } from "../repository";
import { Users } from "../models/index";
import sendMail from '../utils/sendMail';
interface singInData {
  name: string;
  email: string;
  password: string;
}
const UserServices = {
  async singUp(data: singInData) {
    try {
      const isExists = await this.getUserByEmail(data.email);
      if (!isExists) {
        const response = await UserRepository.singUp(data);
        return response;
      } else {
        return null;
      }
    } catch (error) {
      return error;
    }
  },
  async getUserByEmail(email: string) {
    try {
      const response = await UserRepository.getUserByEmail(email);
      return response;
    } catch (error) {
      return error;
    }
  },
  async login(users:Users,password:string): Promise< any | string | null> {
    try {
      const match = await users.comparePassword(password);
      if (!match) {
        return null;
      }
      const token = users.genJWT();
      return token;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};

export default UserServices;
