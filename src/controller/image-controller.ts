import { Request, Response } from 'express';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import { imagesServices } from '../services';

// Handle the upload file
interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
}

const imagesController = {
  //async function to handle the image uploads
  async uploadImages(req: ExtendedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "File not found" });
      }

      const filePath: string = req.file.path;
      console.log(filePath);
      //Instance of the AdmZip class
      const zip = new AdmZip(filePath);
      const uploadDir = path.join(__dirname,"../", '../uploads/images');

      // Extracting the zip file 
      zip.extractAllTo(uploadDir, true);

      // Deleting the original zip file 
      fs.unlinkSync(filePath);

      return res.status(201).json({ message: "Uploaded and extracted images successfully" });
    } catch (error) {
      console.error("Error processing the images:", error);
      return res.status(500).json({ message: "An error occurred while processing the file" });
    }
  },

  //async function to get images by ID
  async getImageById(req:Request,res:Response)
  {
    try{
      const ID=req.params.id;
      //request getImageById function to get the image corresponds to given ID
      const response=await imagesServices.getImageById(ID);
      if(response==null)
      {
        return res.status(404).json({message:"file doesn't exsits"});
      }
      return res.status(200).json(response);
      
    }catch(error:any)
    {
      if(error.errno===-4058)
      {
        return res.status(500).json({message:"file doesn't exsits"});
      }
      return res.status(500).json({error:error});
    }
  }
};

export default imagesController;
