import { studentServices } from "../services";
import { Request, Response } from "express";
import ExcelJS from "exceljs";
import { Engg_Record, Sem_Details } from "../types/engg";

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
  async getRankListByBatch(req:Request,res:Response){
    try{
      const batch:string=req.params.batch;

      // get rank list 
      const records:any=await studentServices.getRankListByBatch(batch);
      if(!records || records.length===0){
        return res.status(404).json({message:"Batch is not found"});
      }
      // return res.status(200).json(response);

      const workbook=new ExcelJS.Workbook();
      const worksheet=workbook.addWorksheet(`${batch}`);
      worksheet.columns=[
        {header:'REGULATION',key:'REGULATION'},
        {header:'ID',key:'ID'},
        {header:'SNAME',key:'SNAME'},
        {header:'FNAME',key:'FNAME'},
        {header:'DOB',key:'DOB'},
        {header:'SEM',key:'SEM'},
        {header:'SGPA',key:'SGPA'},
        {header:'CGPA',key:'CGPA'},
        {header:'DOJ',key:'DOJ'}
      ];
      
      records.forEach((record:Engg_Record)=>{
        record.ENGG_RECORDS.forEach((sem:Sem_Details)=>{
          worksheet.addRow({
            REGULATION:record.REGULATION,
            ID:record.ID,
            SNAME:record.SNAME,
            FNAME:record.FNAME,
            DOB:record.DOB,
            SEM:sem.SEM,
            SGPA:sem.SGPA,
            CGPA:sem.CGPA,
            DOJ:record.DOJ,
          });
        });
      });

      // Prepare to send the file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader(`Content-Disposition`, `attachment; filename=${batch}_Rank_List.xlsx`);

      await workbook.xlsx.write(res);
      res.end();

    }catch(e:any){
      return res.status(500).json({error:e.message});
    };
  },
};

export default studentController;
