import { Model } from "mongoose";
import { Response } from "express";
import { promises as fsPromises } from "fs";
import path from "path";
var res: Response;
const CrudRepository = {
  async create(model: Model<any>, data: {}) {
    try {
      const result = await model.create(data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  async uploadExcel(model: Model<any>, data: {}) {
    try {
      const response = await model.create(data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async findBy(model: Model<any>, ID: String) {
    try {
      const response = await model.findOne({ ID: ID });
      if (!response) {
        return { message: "user not found" };
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  async findAllBy(model: Model<any>, batch: String) {
    try {
      const response = await model.find({ REGULATION: batch });
      if (!response || response.length === 0) {
        return null;
      }
      return response;
    } catch (error) {
      console.log(error);
      return "An error occurred while fetching data";
    }
  },
  async imageBy(ID: string) {
    // Correct the path to point to the actual 'uploads/images' folder
    const filePath = path.join(__dirname, "../","../uploads/images/", `${ID}.png`);
    try {
      // Check if the file exists
      await fsPromises.access(filePath);

      // If the file exists, return the image URL
      return { image: `http://localhost:8000/uploads/images/${ID}` };
    } catch (error) {
      throw error;
    }
  },
};

export default CrudRepository;
