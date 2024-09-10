import { studentServices } from "../services";
import { Request, Response } from "express";

const studentController = {
  async getStudentById(req: Request, res: Response) {
    try {
      const ID = req.params.id;
      const response = await studentServices.getStudentById(ID);
      if (!response) {
        return null;
      }
      // Return the response and exit the function
      return response;
    } catch (error) {
      console.error("Error in getStudentById:", error);
      // Return the error response and exit the function
      return res.status(500).json({ message: "An error occurred" });
    }
  },

  async getAllStudentsByBatch(req: Request, res: Response) {
    try {
      const Batch = req.params.batch;
      const response = await studentServices.getAllStudentsByBatch(Batch);
      if (!response || response.length === 0) {
        return null;
      }
      return response;
    } catch (error) {
      return res.status(500).json({ message: "An error occurred" });
    }
  }
};

export default studentController;
