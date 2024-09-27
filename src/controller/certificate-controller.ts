import e, { Request,Response } from "express";
import { certificateServices } from "../services/index";
const certificateController={
   async updatePUCIssuedDate (req:Request,res:Response)
   {
        try
        {
            const response=await certificateServices.updatePUCIssuedDate(req.body);
            return res.status(200).json(response);
        }catch(error)
        {
            return error;
        }
   },
   async updateEnggIssuedDate (req:Request,res:Response)
   {
        try
        {
            const response=await certificateServices.updateEnggIssuedDate(req.body);
            return res.status(200).json(response);
        }catch(error)
        {   
            return error;
        }
   }
};

export default certificateController;