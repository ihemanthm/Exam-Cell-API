import { studentServices } from "../services";
import { Request, Response } from "express";

const studentController = {
  //async function to get PUC details by ID
  async getPUCDetails(req: Request, res: Response) {
    try {
      const ID = req.params.id;

      // fetch puc data 
      const response = await studentServices.getPUCDetails(ID);
      if (!response) {
        return res.status(404).json({message:"student is not found"});
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({error:error});
    }
  },
  //async function to get ENGG details by ID
  async getEnggDetails(req: Request, res: Response) {
    try {
      const ID = req.params.id;
      
      // fetch engg data 
      const response = await studentServices.getEnggDetails(ID);
      if (!response) {
        return res.status(404).json({message:"student is not found"});
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({error:error});
    }
  },
  
  //async function to get PUC Details by Regulation
  async getPUCDetailsByBatch(req: Request, res: Response) {
    try {
      const Batch = req.params.batch;

      //fetch PUC details by regulation
      const response:any= await studentServices.getPUCDetailsByBatch(Batch);
      if (!response || response.length === 0) {
        return res.status(404).json({message:"Batch is not found"});
      }
      return res.status(200).json(response);
    } catch (error:any) {
      return res.status(500).json({ error: error.message});
    }
  },

  // async function to get ENGG details by Regulation
  async getEnggDetailsByBatch(req: Request, res: Response) {
    try {
      const Batch = req.params.batch;
  
      // fetch ENGG details by Regulation 
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
