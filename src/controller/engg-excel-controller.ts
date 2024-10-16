/*import { Request, Response } from "express";
import xlsx from "xlsx";
import { enggExcelServices } from "../services/index";

//Handle the upload file
interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
}

//define columns of Excel sheet as RowData
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
  DOJ: Date;
  EXAMMY: Date;
}

//define entities of Subject
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

//define entities of Record
interface Record {
  SEM: number;
  SGPA: number;
  CGPA: number;
  TCR: number;
  SEM_TOTAL_REMS: number;
  SEM_CURRENT_REMS: number;
  SUBJECTS: Subject[];
}

// define entities of studentRecord
interface StudentRecord {
  REGULATION: string;
  ID: string;
  SNAME: string;
  FNAME: string;
  GRP: string;
  DOB: Date;
  DOJ: Date;
  CONSILIDATE_CERTIFICATE_NO:string,
  PROVISIONAL_CERTIFICATE_NO:string,
  ORIGINAL_DEGREE_CERTIFICATE_NO:string,
  ISSUED_SEM_CARDS_NUMBER:number,
  TOTAL_REMS: number;
  CURRENT_REMS: number;
  ENGG_RECORDS: Record[];
}

const enggExcelController = {
  //async function to handle the excel upload
  async uploadExcel(
    req: ExtendedRequest,
    res: Response
  ): Promise<Response | any> {
    var TOTAL_REMS = 0;
    var CURRENT_REMS = 0;
    var SEM_TOTAL_REMS = 0;
    var SEM_CURRENT_REMS = 0;
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const filePath: string = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];

      //formatting the date fields
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
            TOTAL_REMS,
            CONSILIDATE_CERTIFICATE_NO:'',
            PROVISIONAL_CERTIFICATE_NO:'',
            ORIGINAL_DEGREE_CERTIFICATE_NO:'',
            ISSUED_SEM_CARDS_NUMBER:0,
            CURRENT_REMS,
            ENGG_RECORDS: [],
          };
        }
        //search if record already exists
        let record = records[ID].ENGG_RECORDS.find((r) => r.SEM == SEM);

        //create new record if not exists
        if (!record) {
          record = {
            SEM,
            CGPA,
            SGPA,
            TCR,
            SEM_TOTAL_REMS,
            SEM_CURRENT_REMS,
            SUBJECTS: [],
          };
          records[ID].ENGG_RECORDS.push(record);
        }

        //store the subjects data for each subject
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

      // sort all students data based on students ID
      const sortedRecords = Object.values(records).sort((a, b) => {
        const aID = parseInt(a.ID.slice(1), 10);
        const bID = parseInt(b.ID.slice(1), 10);
        return aID - bID;
      });

      //sort each students subject data based on Paper number
      sortedRecords.forEach((student) => {
        student.ENGG_RECORDS.forEach((record) => {
          record.SUBJECTS.sort((a, b) => a.PNO - b.PNO);

          // update the individual sem remedials counts
          record.SUBJECTS.forEach((sub) => {
            if (sub.ATTEMPT != "Regular") {
              record.SEM_TOTAL_REMS += 1;
              record.SEM_CURRENT_REMS += 1;
            }
          });
          //update the total remedials count
          student.TOTAL_REMS += record.SEM_TOTAL_REMS;
          student.CURRENT_REMS += record.SEM_CURRENT_REMS;
        });

        //sort the semesters based on sem number
        student.ENGG_RECORDS.sort((a, b) => Number(a.SEM) - Number(b.SEM));
      });

      //call function to update each student data in ascnending order
      for (const student of sortedRecords) {
        await enggExcelServices.uploadExcelFile(student);
      }

      res.status(201).json({ message: "success" });
    } catch (error: any) {
      if (error.code === 11000) {
        const regex = /index: (.+) dup key: { (\w+): "(.*)" }/;

        const match = error.message.match(regex);

        if (match) {
          return res.status(500).json({
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

export default enggExcelController;*/

import { Request, Response } from "express";
import xlsx from "xlsx";
import { enggExcelServices, studentServices } from "../services/index";
import CrudRepository from "../repository/crud-repository";

import { ENGG_RECORD } from "../models";

import{
  Row_Data,
  Subject,
  Sem_Details,
  Current_Remedials,
  Engg_Record,
} from "../types/engg";
import { StudentRepository } from "../repository";

//Handle the upload file
interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
}

const enggExcelController= {
  
  // async function to get student records from model
  async getEnggDetails(ID: string):Promise<Engg_Record | null>{
    return await studentServices.getEnggDetails(ID);
  },
  //async function to update student records from model
  async updateEnggRecords(data: { ID: string; [key: string]: any }):Promise<Response>{
    return await CrudRepository.update(ENGG_RECORD, data);
  },

  //async function to handle the excel upload
  async uploadExcel(
    req: ExtendedRequest,
    res: Response
  ): Promise<Response | any> {
    var TOTAL_REMS = 0;
    var CURRENT_REMS = 0;
    var SEM_TOTAL_REMS = 0;
    var SEM_CURRENT_REMS = 0;
    var duplicateArray:number[]=Array(8).fill(0);
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath: string = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];

      //formatting the date fields
      const data: Row_Data[] = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName],
        {
          raw: false,
          dateNF: "dd-mmm-yyyy",
        }
      );

      const records: { [key: string]: Engg_Record } = {};

      for (const row of data) {
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
        if (ATTEMPT.toUpperCase() === "REMEDIAL") {
          // get student by Id from model
          const student: any = await studentServices.getEnggDetails(ID);

          if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
          }

          //search for the record
          let record: any = student.REMEDIAL_RECORDS.find(
            (r: any) => r.SEM == SEM
          );

          //create new record if not exists
          if (!record) {
            record = {
              SEM,
              CGPA,
              SGPA,
              TCR,
              SEM_TOTAL_REMS,
              SEM_CURRENT_REMS,
              SUBJECTS: [],
            };
            student.REMEDIAL_RECORDS.push(record);
          }
          //store the subjects data for each subject
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

          //Update the Obtained Credits
          student.OBTAINED_CREDITS[SEM-1]+=TGRP;

          //update the CURRENT_REMEDIALS attribute
          if (
            GR.toUpperCase() != "R" &&
            GR.toUpperCase() != "AB" &&
            GR.toUpperCase() != "DETAINED" &&
            GR.toUpperCase() != "MP"
          ) {
            student.CURRENT_REMEDIALS = student.CURRENT_REMEDIALS.filter(
              (sub: any) => sub.PCODE !== PCODE
            );
          }

          //sort the records based on paperNumber
          student.REMEDIAL_RECORDS.forEach((record: Sem_Details) => {
            record.SUBJECTS.sort((a: Subject, b: Subject) => {
              if (a.PNO !== b.PNO) {
                return a.PNO - b.PNO; // Ascending order for PNO
              }
              return (
                new Date(b.EXAMMY).getDate() - new Date(a.EXAMMY).getDate()
              );
            });
          });

          //sort the semesters based on sem number
          student.REMEDIAL_RECORDS.sort(
            (a: any, b: any) => Number(a.SEM) - Number(b.SEM)
          );

          await CrudRepository.update(ENGG_RECORD, student);
        } else {
          //Regular Mode Examinations
          if (!records[ID]) {
            records[ID] = {
              REGULATION,
              ID,
              SNAME,
              FNAME,
              GRP,
              DOB,
              DOJ,
              TOTAL_REMS,
              CONSILIDATE_CERTIFICATE_NO: "",
              PROVISIONAL_CERTIFICATE_NO: "",
              ORIGINAL_DEGREE_CERTIFICATE_NO: "",
              ISSUED_SEM_CARDS_NUMBER: 0,
              CURRENT_REMS,
              OBTAINED_CREDITS:Array(8).fill(0),
              TOTAL_CREDITS:Array(8).fill(0),
              ENGG_RECORDS: [],
              REMEDIAL_RECORDS: [],
              CURRENT_REMEDIALS: [],
            };
          }

          //search if record already exists
          let record = records[ID].ENGG_RECORDS.find((r) => r.SEM == SEM);

          //create new record if not exists
          if (!record) {
            record = {
              SEM,
              CGPA,
              SGPA,
              TCR,
              SEM_TOTAL_REMS,
              SEM_CURRENT_REMS,
              SUBJECTS: [],
            };
            records[ID].ENGG_RECORDS.push(record);
          }

          //store the subjects data for each subject
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
          // Update the Obtained and total credits for each student to calculate CGPA
          records[ID].OBTAINED_CREDITS[SEM-1]+=TGRP;
          records[ID].TOTAL_CREDITS[SEM-1]+=TCR;
        }
      }
      // sort all students data based on students ID
      const sortedRecords = Object.values(records).sort((a, b) => {
        const aID = parseInt(a.ID.slice(1), 10);
        const bID = parseInt(b.ID.slice(1), 10);
        return aID - bID;
      });

      if (sortedRecords.length === 0) {
        return res.status(201).json({ message: "success" });
      }

      //sort each students subject data based on Paper number
      sortedRecords.forEach((student) => {
        student.ENGG_RECORDS.forEach((record:Sem_Details) => {
          record.SUBJECTS.sort((a, b) => a.PNO - b.PNO);

          // update the individual sem remedials counts
          record.SUBJECTS.forEach((sub) => {
            if (
              sub.GR == "R" ||
              sub.GR == "AB" ||
              sub.GR == "Detained" ||
              sub.GR == "MP"
            ) {
              record.SEM_TOTAL_REMS += 1;
              record.SEM_CURRENT_REMS += 1;
            }
          });

          //update the total remedials count
          student.TOTAL_REMS += record.SEM_TOTAL_REMS;
          student.CURRENT_REMS += record.SEM_CURRENT_REMS;
        });

        //sort the semesters based on sem number
        student.ENGG_RECORDS.sort((a, b) => Number(a.SEM) - Number(b.SEM));
      });

      // update current Remedials Data
      sortedRecords.forEach((student) => {
        student.ENGG_RECORDS.forEach((record: Sem_Details, index: number) => {
          if (record.SEM_CURRENT_REMS != 0) {
            record.SUBJECTS.forEach((sub: any) => {
              if (
                sub.GR == "R" ||
                sub.GR == "AB" ||
                sub.GR == "Detained" ||
                sub.GR == "MP"
              ) {
                student.CURRENT_REMEDIALS.push({
                  SEM: index + 1,
                  PNO: sub.PNO,
                  PCODE: sub.PCODE,
                  PNAME: sub.PNAME,
                  EXAMMY: sub.EXAMMY,
                  CR: sub.CR,
                  GR: sub.GR,
                  GRPTS: sub.GRPTS,
                  TGPR: sub.TGRP,
                  TCR: record.TCR,
                  ATTEMPTS: 0,
                });
              }
            });
          }
        });
      });

      //call function to update each student data in ascending order
      for (const student of sortedRecords) {
        await enggExcelServices.uploadExcelFile(student);
      }

      return res.status(201).json({ message: "success" });
    } catch (error: any) {
      if (error.code === 11000) {
        const regex = /index: (.+) dup key: { (\w+): "(.*)" }/;

        const match = error.message.match(regex);

        if (match) {
          return res.status(500).json({
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
