import { Request, Response } from "express";
import { pucExcelServices, studentServices } from "../services/index";
import xlsx from "xlsx";

import { Row_Data, Subject, Sem_Details, Puc_Record } from "../types/puc";
import { CrudRepository } from "../repository";
import { PUC_RECORD } from "../models";

interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
}

const pucExcelController = {
  
  async uploadExcel(req: ExtendedRequest, res: Response): Promise<Response> {

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
      const data: Row_Data[] = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName],
        {
          raw: false,
          dateNF: "dd-mmm-yyyy",
        }
      );

      const records: { [key: string]: Puc_Record } = {};

      const invalidGrades: string[] = ["R", "MP", "AB", "DETAINED"];

      for (const row of data) {
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
          ATTEMPT,
        } = row;

        const student: Puc_Record | undefined | null =
          await studentServices.getPUCDetails(ID);
        if (ATTEMPT.toUpperCase() === "REMEDIAL") {
          if (!student) {
            return res
              .status(400)
              .json({ message: `No student record found for ID :${ID}` });
          }

          const semester: Sem_Details | undefined = student.PUC_RECORDS.find(
            (sem: Sem_Details) => sem.SEM_NO == SEM_NO
          );
          if (!semester) {
            return res.status(400).json({
              message: `No semester-${SEM_NO} found for student Id:${ID} `,
            });
          }

          const subject: Subject | undefined = semester.SUBJECTS.find(
            (sub: Subject) =>
              sub.PNO == PNO && invalidGrades.includes(sub.GR.toUpperCase())
          );
          if (!subject) {
            return res.status(400).json({
              message: `No remedial for student with ID:${ID} in subject ${PNAME}`,
            });
          }

          student.REMEDIAL_RECORDS.push({
            YEAR_SEM,
            SEM_NO,
            SEMCR,
            PNO,
            PCODE,
            PNAME,
            CR: subject.CR,
            GR: subject.GR,
            GRPTS: subject.GRPTS,
            TGRP: subject.TGRP,
            CCMY: subject.CCMY,
            ATTEMPT: subject.ATTEMPT,
            TOTAL_ATTEMPTS: subject.TOTAL_ATTEMPTS,
          });

          subject.CR = CR;
          subject.GR = GR;
          subject.GRPTS = GRPTS;
          subject.TGRP = TGRP;
          subject.CCMY = CCMY;
          subject.ATTEMPT = ATTEMPT;
          subject.TOTAL_ATTEMPTS += 1;

          if (!invalidGrades.includes(GR.toUpperCase())) {
            student.CURRENT_REMS -= 1;
          }

          await CrudRepository.update(PUC_RECORD, student);

        } else {
          if (!student) {
            if (!records[ID]) {
              records[ID] = {
                REGULATION,
                SNAME,
                FNAME,
                ID,
                GRP,
                CERTIFICATE_NUMBER: "",
                TOTAL_REMS,
                CURRENT_REMS,
                PUC_RECORDS: [],
                REMEDIAL_RECORDS: [],
              };
            }
            
            let record = records[ID].PUC_RECORDS.find(
              (r) => r.YEAR_SEM === YEAR_SEM && r.SEM_NO === SEM_NO
            );

            if (!record) {
              record = {
                YEAR_SEM,
                SEM_NO,
                SEMCR,
                SEM_TOTAL_REMS,
                SEM_CURRENT_REMS,
                SUBJECTS: [],
              };
              records[ID].PUC_RECORDS.push(record);
            }

            record = records[ID].PUC_RECORDS.find(
              (r) => r.YEAR_SEM === YEAR_SEM && r.SEM_NO === SEM_NO
            );

            record?.SUBJECTS.push({
              PNO,
              PCODE,
              PNAME,
              CR,
              GRPTS,
              TGRP,
              CCMY,
              GR,
              ATTEMPT,
              TOTAL_ATTEMPTS: 1,
            });

          } else {

            var puc_record: Sem_Details | undefined = student.PUC_RECORDS.find(
              (puc_record: Sem_Details) => puc_record.SEM_NO == SEM_NO
            );

            if (!puc_record) {
              puc_record = {
                YEAR_SEM,
                SEM_NO,
                SEMCR,
                SEM_TOTAL_REMS,
                SEM_CURRENT_REMS,
                SUBJECTS: [],
              };
              student.PUC_RECORDS.push(puc_record);
            }

            puc_record = student.PUC_RECORDS.find(
              (puc_record: Sem_Details) => puc_record.SEM_NO == SEM_NO
            );

            var subject_record: Subject | undefined = puc_record?.SUBJECTS.find(
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
                CCMY,
                GR,
                ATTEMPT,
                TOTAL_ATTEMPTS: 1,
              };

              puc_record?.SUBJECTS.push(subject_record);
            }else{

              subject_record.PNO=PNO;
              subject_record.PCODE=PCODE;
              subject_record.PNAME=PNAME;
              subject_record.CR=CR;
              subject_record.GRPTS=GRPTS;
              subject_record.TGRP=TGRP;
              subject_record.CCMY=CCMY;
              subject_record.GR=GR;
              subject_record.ATTEMPT=ATTEMPT;

            }
            await CrudRepository.update(PUC_RECORD, student);
          }
        }
      }
      if (Object.values(records).length>0) {
        
        const sortedRecords = Object.values(records).sort((a, b) => {
          const bNumericID = parseInt(b.ID.slice(1), 10); 
          const aNumericID = parseInt(a.ID.slice(1), 10); 
          return aNumericID - bNumericID;
        });

        sortedRecords.forEach((student) => {
          student.PUC_RECORDS.forEach((record) => {
            record.SUBJECTS.sort((a, b) => a.PNO - b.PNO);

            record.SUBJECTS.forEach((sub) => {
              if (invalidGrades.includes(sub.GR)) {
                record.SEM_TOTAL_REMS += 1;
                record.SEM_CURRENT_REMS += 1;
              }
            });

            student.TOTAL_REMS += record.SEM_TOTAL_REMS;
            student.CURRENT_REMS += record.SEM_CURRENT_REMS;
          });

          student.PUC_RECORDS.sort(
            (a, b) => Number(a.SEM_NO) - Number(b.SEM_NO)
          );
        });

        for (const student of sortedRecords) {
          await pucExcelServices.uploadExcelFile(student);
        }
      }
      return res.status(201).json({ message: "Uploaded Excel successfully" });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "An error occurred while processing the file" });
    }
  },
  
};

export default pucExcelController;
