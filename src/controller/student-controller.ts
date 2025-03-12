import { studentServices } from "../services";
import { Request, Response } from "express";
import ExcelJS from "exceljs";
import { Engg_Record, Sem_Details, Subject } from "../types/engg";

const studentController = {

  async getPUCDetails(req: Request, res: Response) {

    try {
      const ID = req.params.id;

      const response = await studentServices.getPUCDetails(ID);
      if (!response) {
        return res.status(404).json({ message: "student is not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  async getEnggDetails(req: Request, res: Response) {

    try {
      const ID = req.params.id;

      const response = await studentServices.getEnggDetails(ID);
      if (!response) {
        return res.status(404).json({ message: "student is not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  async getPUCDetailsByBatch(req: Request, res: Response) {

    try {
      const Batch = req.params.batch;
      const response: any = await studentServices.getPUCDetailsByBatch(Batch);
      if (!response || response.length === 0) {
        return res.status(404).json({ message: "Batch is not found" });
      }
      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getEnggDetailsByBatch(req: Request, res: Response) {

    try {
      const Batch = req.params.batch;
      const response: any = await studentServices.getEnggDetailsByBatch(Batch);
      if (!response || response.length === 0) {
        return res.status(404).json({ message: "Batch is not found" });
      }
      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getRankListByBatch(req: Request, res: Response) {

    try {
      const batch: string = req.params.batch;
      const records: any = await studentServices.getRankListByBatch(batch);
      if (!records || records.length === 0) {
        return res.status(404).json({ message: "Batch is not found" });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`${batch}`);
      worksheet.columns = [
        { header: 'REGULATION', key: 'REGULATION' },
        { header: 'ID', key: 'ID' },
        { header: 'SNAME', key: 'SNAME' },
        { header: 'FNAME', key: 'FNAME' },
        { header: 'DOB', key: 'DOB' },
        { header: 'SEM', key: 'SEM' },
        { header: 'SGPA', key: 'SGPA' },
        { header: 'CGPA', key: 'CGPA' },
        { header: 'DOJ', key: 'DOJ' }
      ];

      records.forEach((record: Engg_Record) => {
        record.ENGG_RECORDS.forEach((sem: Sem_Details) => {
          worksheet.addRow({
            REGULATION: record.REGULATION,
            ID: record.ID,
            SNAME: record.SNAME,
            FNAME: record.FNAME,
            DOB: record.DOB,
            SEM: sem.SEM,
            SGPA: sem.SGPA,
            CGPA: sem.CGPA,
            DOJ: record.DOJ,
          });
        });
      });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader(`Content-Disposition`, `attachment; filename=${batch}_Rank_List.xlsx`);

      await workbook.xlsx.write(res);
      res.end();

    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    };
  },

  async getABCData(req: Request, res: Response) {
    try {

      const batch: string = req.query.batch as string;
      const records: Engg_Record[] = await studentServices.getEnggDetailsByBatch(batch) as Engg_Record[];

      if (!records || records.length === 0) {
        return res.status(404).json({ message: "Batch is not found" });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`${batch}`);

      let worksheetColumns = [
        { header: 'IDSEM', key: 'IDSEM' },
        { header: 'YEAR & SEM', key: 'YEAR_SEM' },
        { header: 'ORG_NAME', key: 'ORG_NAME' },
        { header: 'ACADEMIC_COURSE_ID', key: 'ACADEMIC_COURSE_ID' },
        { header: 'COURSE_NAME', key: 'COURSE_NAME' },
        { header: 'STREAM', key: 'STREAM' },
        { header: 'SESSION', key: 'SESSION' },
        { header: 'REGN_NO', key: 'REGN_NO' },
        { header: 'RROLL', key: 'RROLL' },
        { header: 'CNAME', key: 'CNAME' },
        { header: 'GENDER', key: 'GENDER' },
        { header: 'DOB', key: 'DOB' },
        { header: 'FNAME', key: 'FNAME' },
        { header: 'MNAME', key: 'MNAME' },
        { header: 'PHOTO', key: 'PHOTO' },
        { header: 'MRKS_REC_STATUS', key: 'MRKS_REC_STATUS' },
        { header: 'RESULT', key: 'RESULT' },
        { header: 'YEAR', key: 'YEAR' },
        { header: 'MONTH', key: 'MONTH' },
        { header: 'PERCENT', key: 'PERCENT' },
        { header: 'DOI', key: 'DOI' },
        { header: 'SEM', key: 'SEM' },
        { header: 'CERT_NO', key: 'CERT_NO' },
        { header: 'TOT', key: 'TOT' },
        { header: 'TOT_MIN', key: 'TOT_MIN' },
        { header: 'TOT_MRKS', key: 'TOT_MRKS' },
        { header: 'TOT_TH_MAX', key: 'TOT_TH_MAX' },
        { header: 'TOT_TH_MIN', key: 'TOT_TH_MIN' },
        { header: 'TOT_TH_MRKS', key: 'TOT_TH_MRKS' },
        { header: 'TOT_PR_MAX', key: 'TOT_PR_MAX' },
        { header: 'TOT_PR_MIN', key: 'TOT_PR_MIN' },
        { header: 'TOT_PR_MRKS', key: 'TOT_PR_MRKS' },
        { header: 'TOT_CE_MAX', key: 'TOT_CE_MAX' },
        { header: 'TOT_CE_MIN', key: 'TOT_CE_MIN' },
        { header: 'TOT_CE_MRKS', key: 'TOT_CE_MRKS' },
        { header: 'TOT_VV_MAX', key: 'TOT_VV_MAX' },
        { header: 'TOT_VV_MIN', key: 'TOT_VV_MIN' },
        { header: 'TOT_VV_MRKS', key: 'TOT_VV_MRKS' },
        { header: 'TOT_CREDIT', key: 'TOT_CREDIT' },
        { header: 'TOT_CREDIT_POINTS', key: 'TOT_CREDIT_POINTS' },
        { header: 'TOT_GRADE_POINTS', key: 'TOT_GRADE_POINTS' },
        { header: 'GRAND_TOT_MAX', key: 'GRAND_TOT_MAX' },
        { header: 'GRAND_TOT_MIN', key: 'GRAND_TOT_MIN' },
        { header: 'GRAND_TOT_MRKS', key: 'GRAND_TOT_MRKS' },
        { header: 'GRAND_TOT_CREDIT', key: 'GRAND_TOT_CREDIT' },
        { header: 'CGPA', key: 'CGPA' },
        { header: 'REMARKS', key: 'REMARKS' },
        { header: 'SGPA', key: 'SGPA' },
        { header: 'ABC_ACCOUNT_ID', key: 'ABC_ACCOUNT_ID' },
        { header: 'TERM_TYPE', key: 'TERM_TYPE' },
        { header: 'TOT_GRADE', key: 'TOT_GRADE' }
      ];

      for (let i = 1; i <= 11; i++) {
        worksheetColumns.push({ header: `SUB${i}NM`, key: `SUB${i}NM` });
        worksheetColumns.push({ header: `SUB${i}`, key: `SUB${i}` });
        worksheetColumns.push({ header: `SUB${i}MAX`, key: `SUB${i}MAX` });
        worksheetColumns.push({ header: `SUB${i}MIN`, key: `SUB${i}MIN` });
        worksheetColumns.push({ header: `SUB${i}_TH_MAX`, key: `SUB${i}_TH_MAX` });
        worksheetColumns.push({ header: `SUB${i}_VV_MRKS`, key: `SUB${i}_VV_MRKS` });
        worksheetColumns.push({ header: `SUB${i}_PR_CE_MRKS`, key: `SUB${i}_PR_CE_MRKS` });
        worksheetColumns.push({ header: `SUB${i}_TH_MIN`, key: `SUB${i}_TH_MIN` });
        worksheetColumns.push({ header: `SUB${i}_PR_MAX`, key: `SUB${i}_PR_MAX` });
        worksheetColumns.push({ header: `SUB${i}_PR_MIN`, key: `SUB${i}_PR_MIN` });
        worksheetColumns.push({ header: `SUB${i}_CE_MAX`, key: `SUB${i}_CE_MAX` });
        worksheetColumns.push({ header: `SUB${i}_CE_MIN`, key: `SUB${i}_CE_MIN` });
        worksheetColumns.push({ header: `SUB${i}_TH_MRKS`, key: `SUB${i}_TH_MRKS` });
        worksheetColumns.push({ header: `SUB${i}_PR_MRKS`, key: `SUB${i}_PR_MRKS` });
        worksheetColumns.push({ header: `SUB${i}_CE_MRKS`, key: `SUB${i}_CE_MRKS` });
        worksheetColumns.push({ header: `SUB${i}_TOT`, key: `SUB${i}_TOT` });
        worksheetColumns.push({ header: `SUB${i}_GRADE`, key: `SUB${i}_GRADE` });
        worksheetColumns.push({ header: `SUB${i}_GRADE_POINTS`, key: `SUB${i}_GRADE_POINTS` });
        worksheetColumns.push({ header: `SUB${i}_CREDIT`, key: `SUB${i}_CREDIT` });
        worksheetColumns.push({ header: `SUB${i}_CREDIT_POINTS`, key: `SUB${i}_CREDIT_POINTS` });
        worksheetColumns.push({ header: `SUB${i}_REMARKS`, key: `SUB${i}_REMARKS` });
        worksheetColumns.push({ header: `SUB${i}_VV_MIN`, key: `SUB${i}_VV_MIN` });
        worksheetColumns.push({ header: `SUB${i}_VV_MAX`, key: `SUB${i}_VV_MAX` });
        worksheetColumns.push({ header: `SUB${i}_TH_CE_MRKS`, key: `SUB${i}_TH_CE_MRKS` });
      }
      worksheetColumns.push({ header: 'AADHAAR_NAME', key: 'AADHAAR_NAME' });
      worksheetColumns.push({ header: 'ADMISSION_YEAR', key: 'ADMISSION_YEAR' });

      worksheet.columns = worksheetColumns;


      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

      records.forEach((record: Engg_Record) => {
        let cgpa = Array(8).fill(0);
        let obtainedSum = 0, totSum = 0;

        for (let i = 0; i < 8; i++) {
          obtainedSum += record.OBTAINED_CREDITS[i];
          totSum += record.TOTAL_CREDITS[i];
          cgpa[i] = totSum === 0 ? 0 : parseFloat((obtainedSum / totSum).toFixed(2));
        }

        //finding the max no.of subjects
        let maxSubjects = 0;
        record.ENGG_RECORDS.forEach((sem: Sem_Details) => {
          if (sem.SUBJECTS.length > maxSubjects) {
            maxSubjects = sem.SUBJECTS.length;
          }
        });

        record.ENGG_RECORDS.forEach((sem: Sem_Details) => {
          let eachRow: any = {
            IDSEM: `${record.ID}E${Math.ceil(sem.SEM / 2)}SEM${sem.SEM % 2 === 0 ? '2' : '1'}`,
            YEAR_SEM: `E${Math.ceil(sem.SEM / 2)}SEM${sem.SEM % 2 === 0 ? '2' : '1'}`,
            ACADEMIC_COURSE_ID: "B.Tech",
            COURSE_NAME: "Bachelor of Technology",
            STREAM: record.GRP,
            SESSION: "NA",
            REG_NO: record.ID,
            RROLL: record.ID,
            CNAME: record.SNAME,
            GENDER: "M/F",
            DOB: `${record.DOB?.getDate()}/${record.DOB?.getMonth()}/${record.DOB?.getFullYear()}`,
            FNAME: record.FNAME,
            YEAR: sem.EXAMMY?.getFullYear(),
            MONTH: months[sem.EXAMMY?.getMonth() || 0],
            SEM: romans[sem.SEM - 1],
            TOT_CREDIT: sem.TCR,
            TOT_CREDIT_POINTS: sem.OBTAINED_CR,
            CGPA: cgpa[sem.SEM - 1],
            SGPA: sem.SGPA
          }

          sem.SUBJECTS.forEach((sub: Subject, index: number) => {
            eachRow[`SUB${index + 1}NM`] = sub.PNAME;
            eachRow[`SUB${index + 1}`] = sub.PCODE;
            eachRow[`SUB${index + 1}_GRADE`] = sub.GR;
            eachRow[`SUB${index + 1}_GRADE_POINTS`] = sub.GRPTS;
            eachRow[`SUB${index + 1}_CREDIT`] = sub.CR;
            eachRow[`SUB${index + 1}_CREDIT_POINTS`] = sub.TGRP;
          })
          let RemedialRecord = record.REMEDIAL_RECORDS.find((remedial: any) => remedial.SEM === sem.SEM);

          if (RemedialRecord) {
            RemedialRecord.REMEDIAL_DATES.forEach((datedRecord) => {
              datedRecord.SUBJECTS.forEach((sub: Subject) => {
                eachRow[`SUB${sub.PNO}_GRADE`] = sub.GR;
                eachRow[`SUB${sub.PNO}_GRADE_POINTS`] = sub.GRPTS;
                eachRow[`SUB${sub.PNO}_CREDIT_POINTS`] = sub.TGRP;
              })
            })
          }
          // Adding **END**
          eachRow[`SUB${maxSubjects + 1}NM`] = "***END***";
          eachRow['ADMISSION_YEAR'] = record.DOJ?.getFullYear();

          worksheet.addRow(eachRow);
        })
      })

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader(`Content-Disposition`, `attachment; filename=${batch}_ABC_DATA.xlsx`);

      await workbook.xlsx.write(res);
      res.end();

    } catch (e: any) {

      return res.status(500).json({ error: e.message });
    };
  }
};

export default studentController;
