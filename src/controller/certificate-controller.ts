import { Request, Response } from "express";
import { certificateServices } from "../services/index";
// Import your multer configuration

interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
}

const certificateController = {

  async updatePUCIssuedDate(req: Request, res: Response) {
    try {

      const data = {
        ...req.body,
      };

      const response = await certificateServices.updatePUCIssuedDate(data);
      return res.status(200).json(response);
    } catch (error:any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async updateEnggIssuedDate(req: Request, res: Response) {
    try {
    
      const data = {
        ...req.body,
      };

      const response = await certificateServices.updateEnggIssuedDate(data);
      return res.status(200).json(response);
    } catch (error:any) {
      return res.status(500).json({ error: error.message });
    }
  },
  async storeCertificates (req: ExtendedRequest, res: Response)
  {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    return res.status(200).json({message:"file upload successfully"});
  }
};

export default certificateController;
