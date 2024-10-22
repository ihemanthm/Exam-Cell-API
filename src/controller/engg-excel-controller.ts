// import global/dev dependencies
import xlsx from "xlsx";
import { Request, Response } from "express";

// import internal dependencies
import { enggExcelServices, studentServices } from "../services";
import { CrudRepository } from "../repository";

// import model
import { ENGG_RECORD } from "../models";

// import data types
import {
  Row_Data,
  Subject,
  Sem_Details,
  Engg_Record,
  Current_Remedials,
  Remedial_Sem_Details,
  Remedial_Details,
} from "../types/engg";

interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
}

const enggExcelController = {
  //async function to handle the excel upload
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

      //formatting the date fields
      const data: Row_Data[] = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName],
        {
          raw: false,
          dateNF: "dd-mmm-yyyy",
        }
      );

      const records: { [key: string]: Engg_Record } = {};

      const invalidGrades = ["R", "AB", "DETAINED", "MP"];

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
          const student: Engg_Record | undefined | null =
            await studentServices.getEnggDetails(ID);

          if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
          }

          //search for the record
          let record: Remedial_Details | undefined =
            student.REMEDIAL_RECORDS.find((r: any) => r.SEM == SEM);

          //create new record if not exists
          if (!record) {
            record = {
              SEM,
              CGPA,
              SGPA,
              TCR,
              SEM_TOTAL_REMS: 0,
              SEM_CURRENT_REMS: 0,
              REMEDIAL_DATES: [],
            };
            student.REMEDIAL_RECORDS.push(record);
          }

          let Dated_Record: Remedial_Sem_Details | undefined =
            record.REMEDIAL_DATES.find(
              (r: Remedial_Sem_Details) =>
                new Date(r.EXAMMY).getTime() === new Date(EXAMMY).getTime()
            );
          if (!Dated_Record) {
            Dated_Record = {
              EXAMMY: EXAMMY,
              SUBJECTS: [],
            };
            record.REMEDIAL_DATES.push(Dated_Record);
          }
          Dated_Record.SUBJECTS.push({
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

          //update the CURRENT_REMEDIALS attribute
          if (!invalidGrades.includes(GR.toUpperCase())) {
            student.CURRENT_REMEDIALS = student.CURRENT_REMEDIALS.filter(
              (sub: any) => sub.PCODE !== PCODE
            );
          }

          // Sort records based on paperNumber
          student.REMEDIAL_RECORDS.forEach((sem: Remedial_Details) => {
            sem.REMEDIAL_DATES.forEach((record: Remedial_Sem_Details) => {
              record.SUBJECTS.sort((a: Subject, b: Subject) => a.PNO - b.PNO);
            });
            sem.REMEDIAL_DATES.sort(
              (a: Remedial_Sem_Details, b: Remedial_Sem_Details) =>
                new Date(a.EXAMMY).getTime() - new Date(b.EXAMMY).getTime()
            );
          });

          //sort the semesters based on sem number
          student.REMEDIAL_RECORDS.sort(
            (a: Remedial_Details, b: Remedial_Details) =>
              Number(a.SEM) - Number(b.SEM)
          );

          // await student.save();
          await CrudRepository.update(ENGG_RECORD, student);
          await studentServices.updateCredits(student.ID);
        } else {
          if (!records[ID]) {
            records[ID] = {
              REGULATION,
              ID,
              SNAME,
              FNAME,
              GRP,
              DOB,
              DOJ,
              TOTAL_REMS: 0,
              CONSOLIDATE_CERTIFICATE_NO: "",
              PROVISIONAL_CERTIFICATE_NO: "",
              ORIGINAL_DEGREE_CERTIFICATE_NO: "",
              ISSUED_SEM_CARDS_NUMBER: 0,
              CURRENT_REMS: 0,
              OBTAINED_CREDITS: new Array(8).fill(0),
              TOTAL_CREDITS: new Array(8).fill(0),
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
              SEM_TOTAL_REMS: 0,
              SEM_CURRENT_REMS: 0,
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
        }
      }
      if (records) {
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
              if (invalidGrades.includes(sub.GR.toUpperCase())) {
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
        sortedRecords.forEach((student) => {
          student.ENGG_RECORDS.forEach((record: Sem_Details, index: number) => {
            if (record.SEM_CURRENT_REMS != 0) {
              record.SUBJECTS.forEach((sub: any) => {
                if (invalidGrades.includes(sub.GR.toUpperCase())){
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
        //call function to update each student data in ascnending order
        for (const student of sortedRecords) {
          await enggExcelServices.uploadExcelFile(student);
          await studentServices.updateCredits(student.ID);
        }
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
      return res.status(500).json({
        message: "An error occurred while processing the file",
        error: error.message,
      });
    }
  },
};

export default enggExcelController;
