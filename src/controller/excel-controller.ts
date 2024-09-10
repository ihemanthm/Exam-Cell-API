import { Request, Response } from 'express';
import { excelServices } from '../services/index';
import xlsx from 'xlsx';

// Extend the Request interface to include the file property
interface ExtendedRequest extends Request {
  file?: Express.Multer.File; // Correctly use Express.Multer.File
}

interface RowData {
  REGULATION: string;
  SNAME: string;
  FNAME: string;
  ID: string;
  GRP: string;
  YEAR_SEM: string;
  SEM_NO: number;
  PNO: number;
  PCODE: string;
  PNAME: string;
  CR: number;
  GR: string;
  GRPTS: number;
  TGRP: number;
  CCMY:Date;
  ATTEMPT:string;
  SEMCR: number;
}

interface Subject {
  PNO: number;
  PCODE: string;
  PNAME: string;
  CR: number;
  GR: string;
  GRPTS: number;
  TGRP: number;
  ATTEMPT:string;
  CCMY:Date;
}

interface Record {
  YEAR_SEM: string;
  SEMCR: number;
  SEM_NO: number;
  SUBJECTS: Subject[];
}

interface StudentRecord {
  REGULATION: string;
  SNAME: string;
  FNAME: string;
  ID: string;
  GRP: string;
  PUC_RECORDS: Record[];
}

const excelController = {
  async uploadExcel(req: ExtendedRequest, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const filePath: string = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data: RowData[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName],{
        raw:false,
        dateNF:'dd-mmm-yyyy'
      });
      const records: { [key: string]: StudentRecord } = {};

      data.forEach((row: RowData) => {
        const {
          REGULATION,
          SNAME,
          FNAME,
          ID,
          GRP,
          YEAR_SEM,
          SEM_NO,
          PNO,
          PCODE,
          PNAME,
          CR,
          GR,
          GRPTS,
          TGRP,
          SEMCR,
          CCMY,
          ATTEMPT
        } = row;

        if (!records[ID]) {
          records[ID] = {
            REGULATION,
            SNAME,
            FNAME,
            ID,
            GRP,
            PUC_RECORDS: [],
          };
        }

        let record = records[ID].PUC_RECORDS.find(
          (r) => r.YEAR_SEM === YEAR_SEM && r.SEM_NO === SEM_NO
        );

        if (!record) {
          record = { YEAR_SEM, SEM_NO,SEMCR, SUBJECTS: [] };
          records[ID].PUC_RECORDS.push(record);
        }
        record.SUBJECTS.push({
          PNO,
          PCODE,
          PNAME,
          CR,
          GRPTS,
          TGRP,
          CCMY,
          GR,
          ATTEMPT
        });
      });

      const sortedRecords = Object.values(records).sort((a, b) => {
        const aNumericID = parseInt(a.ID.slice(1),10); // Extract numeric part of ID
        const bNumericID = parseInt(b.ID.slice(1),10); // Extract numeric part of ID
        return aNumericID - bNumericID;
      });

      // Sorting subjects based on PNO within each record
      sortedRecords.forEach((student) => {
        student.PUC_RECORDS.forEach((record) => {
          record.SUBJECTS.sort((a, b) => a.PNO - b.PNO);
        });

        // Sorting records based on SEM_NO within each student
        student.PUC_RECORDS.sort((a, b) => Number(a.SEM_NO) - Number(b.SEM_NO));

      });
      

    
      // const recordDocuments = Object.values(sortedRecords);
      for (const student of sortedRecords) {
        await excelServices.uploadExcelFile(student); // This will insert each student in ascending order
      }
      // await excelServices.uploadExcelFile(sortedRecords);
      return res.status(201).json({ message: 'Uploaded Excel successfully' });
    } catch (e) {
      console.error('Error processing the file:', e);
      return res
        .status(500)
        .json({ message: 'An error occurred while processing the file' });
    }
  },
};

export default excelController;

