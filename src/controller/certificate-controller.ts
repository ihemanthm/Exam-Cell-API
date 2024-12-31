import { Request, Response } from "express";
import { certificateServices, studentServices } from "../services/index";
import xlsx from "xlsx";

interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
}

const certificateController = {

  async updatePUCExcelFile(req: ExtendedRequest, res: Response): Promise<Response> {
    try {

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const filePath: string = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      
      const data: any = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName],
        {
          raw: false,
          dateNF: "dd-mmm-yyyy",
        }
      );

      for(const row of data){
        const { ID, CERTIFICATE_NUMBER } = row;
        const student:any = await studentServices.getPUCDetails(ID);
        student.CERTIFICATE_NUMBER = CERTIFICATE_NUMBER;
        await certificateServices.updatePUCIssuedDate(student);
      }
      return res.status(200).json({message:"PUC Certificate Numbers updated successfully"});
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
  async updateEnggExcelFile(req: ExtendedRequest, res: Response): Promise<Response> {
    try {

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath: string = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      
      const data: any = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName],
        {
          raw: false,
          dateNF: "dd-mmm-yyyy",
        }
      );

      for(const row of data){
        const { ID, CONSOLIDATE_CERTIFICATE_NO, PROVISIONAL_CERTIFICATE_NO, ORIGINAL_DEGREE_CERTIFICATE_NO, ISSUED_SEM_CARDS_NUMBER} = row;
        const student:any = await studentServices.getPUCDetails(ID);
        student.CONSOLIDATE_CERTIFICATE_NO = CONSOLIDATE_CERTIFICATE_NO;
        student.PROVISIONAL_CERTIFICATE_NO = PROVISIONAL_CERTIFICATE_NO;
        student.ORIGINAL_DEGREE_CERTIFICATE_NO = ORIGINAL_DEGREE_CERTIFICATE_NO;
        student.ISSUED_SEM_CARDS_NUMBER = ISSUED_SEM_CARDS_NUMBER;
        await certificateServices.updateEnggIssuedDate(student);
      }
      return res.status(200).json({message:"PUC Certificate Numbers updated successfully"});
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
  async updatePUCIssuedDate(req: Request, res: Response) {

    try {
      const data = {
        ...req.body,
      };

      const response = await certificateServices.updatePUCIssuedDate(data);
      return res.status(200).json(response);
    } catch (error: any) {
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
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }

  },

  async storeCertificates(req: ExtendedRequest, res: Response) {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    return res.status(200).json({ message: "file upload successfully" });
  }

};

export default certificateController;
