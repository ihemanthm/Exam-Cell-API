import { Request, Response } from "express";
import xlsx from "xlsx";
import { enggExcelServices } from "../services/index";

interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
}

interface RowData {
  REGULATION: string;
  ID: string;
  SNAME: string;
  FNAME: string;
  GRP: string;
  DOB: Date;
  SEM: number;
  SGPA: number;
  CGPA: number;
  TCR: number;
  PNO: number;
  PCODE: string;
  PNAME: string;
  CR: number;
  GR: string;
  GRPTS: number;
  TGRP: number;
  ATTEMPT: string;
  DOJ:Date;
  EXAMMY: Date;
}

interface Subject {
  PNO: number;
  PCODE: string;
  PNAME: string;
  CR: number;
  GR: string;
  GRPTS: number;
  TGRP: number;
  ATTEMPT: string;
  EXAMMY: Date;
}

interface Record {
  SEM: number;
  SGPA: number;
  CGPA: number;
  TCR: number;
  SUBJECTS: Subject[];
}

interface StudentRecord {
  REGULATION: string;
  ID: string;
  SNAME: string;
  FNAME: string;
  GRP: string;
  DOB: Date;
  DOJ:Date;
  ENGG_RECORDS: Record[];
}

const enggExcelController = {
  async uploadExcel(
    req: ExtendedRequest,
    res: Response
  ): Promise<Response | any> {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const filePath: string = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data: RowData[] = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName],
        {
          raw: false,
          dateNF: "dd-mmm-yyyy",
        }
      );

      const records: { [key: string]: StudentRecord } = {};

      data.forEach((row: RowData) => {
        const {
          REGULATION,
          ID,
          SNAME,
          FNAME,
          GRP,
          DOB,
          SEM,
          SGPA,
          CGPA,
          TCR,
          PNO,
          PCODE,
          PNAME,
          CR,
          GR,
          GRPTS,
          TGRP,
          ATTEMPT,
          DOJ,
          EXAMMY,
        } = row;
        if (!records[ID]) {
          records[ID] = {
            REGULATION,
            ID,
            SNAME,
            FNAME,
            GRP,
            DOB,
            DOJ,
            ENGG_RECORDS: [],
          };
        }
        let record = records[ID].ENGG_RECORDS.find((r) => r.SEM == SEM);

        if (!record) {
          record = { SEM, CGPA, SGPA, TCR, SUBJECTS: [] };
          records[ID].ENGG_RECORDS.push(record);
        }
        record.SUBJECTS.push({
          PNO,
          PCODE,
          PNAME,
          CR,
          GRPTS,
          TGRP,
          EXAMMY,
          GR,
          ATTEMPT,
        });
      });

      const sortedRecords = Object.values(records).sort((a, b) => {
        const aID = parseInt(a.ID.slice(1), 10);
        const bID = parseInt(b.ID.slice(1), 10);
        return aID - bID;
      });

      sortedRecords.forEach((student) => {
        student.ENGG_RECORDS.forEach((record) => {
          record.SUBJECTS.sort((a, b) => a.PNO - b.PNO);
        });

        student.ENGG_RECORDS.sort((a, b) => Number(a.SEM) - Number(b.SEM));
      });
      for (const student of sortedRecords) {
        await enggExcelServices.uploadExcelFile(student); // This will insert each student in ascending order
      }
      res.status(201).json({ message: "success" });
    } catch (error:any) {
      if (error.code === 11000) {
        const regex = /index: (.+) dup key: { (\w+): "(.*)" }/;
        const match = error.message.match(regex);
        if (match) {
          return res
            .status(500)
            .json({
              message: `Duplicate value for field ${match[2]}: ${match[3]}`,
            });
        }
        return res.status(500).json({ message: "internal error" });
      }
      return res
        .status(500)
        .json({ message: "An error occurred while processing the file" });
    }
  },
};

export default enggExcelController;
