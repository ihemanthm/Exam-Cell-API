import xlsx from "xlsx";
import { Request, Response } from "express";
import { enggExcelServices, studentServices } from "../services";
import { CrudRepository } from "../repository";

import { ENGG_RECORD } from "../models";

import {
  Row_Data,
  Subject,
  Sem_Details,
  Engg_Record,
  Remedial_Sem_Details,
  Remedial_Details,
} from "../types/engg";

interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
}

const enggExcelController = {
  
  async uploadExcel(req: ExtendedRequest, res: Response):Promise<Response | any> {

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const filePath: string = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
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
        const student: Engg_Record | undefined | null =
        await studentServices.getEnggDetails(ID);
        if (ATTEMPT.toUpperCase() === "REMEDIAL") {

          if (!student) {
            return res.status(404).json({ message: "Student Not Found" });
          }

          let record: Remedial_Details | undefined =
          student.REMEDIAL_RECORDS.find((r: any) => r.SEM == SEM);
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
          record = student.REMEDIAL_RECORDS.find((r: any) => r.SEM == SEM);

          let Dated_Record: Remedial_Sem_Details | undefined =
            record?.REMEDIAL_DATES.find(
              (r: Remedial_Sem_Details) =>
                new Date(r.EXAMMY).getTime() === new Date(EXAMMY).getTime()
            );
          if (!Dated_Record) {
            Dated_Record = {
              EXAMMY: EXAMMY,
              OBTAINED_CR:0,
              SGPA: 0,
              CGPA: 0,
              SUBJECTS: [],
            };
            record?.REMEDIAL_DATES.push(Dated_Record);
          }
          Dated_Record = record?.REMEDIAL_DATES.find(
            (r: Remedial_Sem_Details) =>
              new Date(r.EXAMMY).getTime() === new Date(EXAMMY).getTime()
          );
          Dated_Record?.SUBJECTS.push({
            PNO,
            PCODE,
            PNAME,
            CR,
            GRPTS,
            TGRP,
            GR,
            ATTEMPT,
          });

          if (!invalidGrades.includes(GR.toUpperCase())) {
            student.CURRENT_REMS -= 1;
            student.CURRENT_REMEDIALS = student.CURRENT_REMEDIALS.filter(
              (sub: any) => sub.PCODE !== PCODE
            );
          }

          student.REMEDIAL_RECORDS.forEach((sem: Remedial_Details) => {
            sem.REMEDIAL_DATES.forEach((record: Remedial_Sem_Details) => {
              record.SUBJECTS.sort((a: Subject, b: Subject) => a.PNO - b.PNO);
            });
            sem.REMEDIAL_DATES.sort(
              (a: Remedial_Sem_Details, b: Remedial_Sem_Details) =>
                new Date(a.EXAMMY).getTime() - new Date(b.EXAMMY).getTime()
            );
          });

          student.REMEDIAL_RECORDS.sort(
            (a: Remedial_Details, b: Remedial_Details) =>
              Number(a.SEM) - Number(b.SEM)
          );

          await CrudRepository.update(ENGG_RECORD, student);
          await studentServices.updateCredits(student.ID);
        } else {
          if (!student) {
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
            let record = records[ID].ENGG_RECORDS.find((r) => r.SEM === SEM);

            if (!record) {
              record = {
                SEM,
                CGPA,
                SGPA,
                TCR,
                OBTAINED_CR:0,
                EXAMMY,
                SEM_TOTAL_REMS: 0,
                SEM_CURRENT_REMS: 0,
                SUBJECTS: [],
              };
              records[ID].ENGG_RECORDS.push(record);
            }

            record.SUBJECTS.push({
              PNO,
              PCODE,
              PNAME,
              CR,
              GRPTS,
              TGRP,
              GR,
              ATTEMPT,
            });
          } else {
            
            var engg_record: Sem_Details | undefined =
              student.ENGG_RECORDS.find(
                (engg_record: Sem_Details) => engg_record.SEM == SEM
              );

            if (!engg_record) {
              engg_record = {
                SEM,
                CGPA,
                SGPA,
                TCR,
                OBTAINED_CR:0,
                EXAMMY,
                SEM_TOTAL_REMS: 0,
                SEM_CURRENT_REMS: 0,
                SUBJECTS: [],
              };
              student.ENGG_RECORDS.push(engg_record);
            }

            engg_record = student.ENGG_RECORDS.find(
              (engg_record: Sem_Details) => engg_record.SEM == SEM
            );

            var subject_record: Subject | undefined =
              engg_record?.SUBJECTS.find(
                (subject_record: Subject) => subject_record.PNO == PNO
              );

            if (!subject_record) {
              subject_record = {
                PNO,
                PCODE,
                PNAME,
                CR,
                GRPTS,
                TGRP,
                GR,
                ATTEMPT,
              };
              engg_record?.SUBJECTS.push(subject_record);
            }else{
              subject_record.PNO=PNO;
              subject_record.PCODE=PCODE;
              subject_record.PNAME=PNAME;
              subject_record.CR=CR;
              subject_record.GR=GR;
              subject_record.GRPTS=GRPTS;
              subject_record.TGRP=TGRP;
              subject_record.ATTEMPT=ATTEMPT;
            }

            if (student) {
              await CrudRepository.update(ENGG_RECORD, student);
              await studentServices.updateCredits(student.ID);
            }
          }
        }
      }
      if (Object.values(records).length > 0) {
        const sortedRecords = Object.values(records).sort((a, b) => {
          const aID = parseInt(a.ID.slice(1), 10);
          const bID = parseInt(b.ID.slice(1), 10);
          return aID - bID;
        });
        sortedRecords.forEach((student) => {
          student.ENGG_RECORDS.forEach((record) => {
            record.SUBJECTS.sort((a, b) => a.PNO - b.PNO);

            record.SUBJECTS.forEach((sub) => {
              if (invalidGrades.includes(sub.GR.toUpperCase())) {
                record.SEM_TOTAL_REMS += 1;
                record.SEM_CURRENT_REMS += 1;
              }
            });
            
            student.TOTAL_REMS += record.SEM_TOTAL_REMS;
            student.CURRENT_REMS += record.SEM_CURRENT_REMS;
          });

          student.ENGG_RECORDS.sort((a, b) => Number(a.SEM) - Number(b.SEM));
        });
        sortedRecords.forEach((student) => {
          student.ENGG_RECORDS.forEach((record: Sem_Details, index: number) => {
            if (record.SEM_CURRENT_REMS != 0) {
              record.SUBJECTS.forEach((sub: any) => {
                if (invalidGrades.includes(sub.GR.toUpperCase())) {
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
        
        for (const student of sortedRecords) {
          await enggExcelServices.uploadExcelFile(student);
          await studentServices.updateCredits(student.ID);
        }
      }
      res.status(201).json({ message: "success" });
    } catch (error: any) {
      return res.status(500).json({
        message: "An error occurred while processing the file",
        error: error.message,
      });
    }
  },
  
};

export default enggExcelController;
