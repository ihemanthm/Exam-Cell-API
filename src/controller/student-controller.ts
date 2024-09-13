import { studentServices } from "../services";
import { Request, Response } from "express";

const studentController = {
  async getPUCDetails(req: Request, res: Response) {
    try {
      const ID = req.params.id;
      const response = await studentServices.getPUCDetails(ID);
      if (!response) {
        return res.status(404).json({message:"student is not found"});
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({error:error});
    }
  },
  async getEnggDetails(req: Request, res: Response) {
    try {
      const ID = req.params.id;
      const response = await studentServices.getEnggDetails(ID);
      if (!response) {
        return res.status(404).json({message:"student is not found"});
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({error:error});
    }
  },

  async getPUCDetailsByBatch(req: Request, res: Response) {
    try {
      const Batch = req.params.batch;
      const response:any= await studentServices.getPUCDetailsByBatch(Batch);
      if (!response || response.length === 0) {
        return res.status(404).json({message:"Batch is not found"});
      }
      return res.status(200).json(response);
    } catch (error:any) {
      return res.status(500).json({ error: error.message});
    }
  },
  async getEnggDetailsByBatch(req: Request, res: Response) {
    try {
      const Batch = req.params.batch;
      const response:any= await studentServices.getEnggDetailsByBatch(Batch);
      if (!response || response.length === 0) {
        return res.status(404).json({message:"Batch is not found"});
      }
      return res.status(200).json(response);
    } catch (error:any) {
      return res.status(500).json({ error: error.message});
    }
  },
};

export default studentController;
