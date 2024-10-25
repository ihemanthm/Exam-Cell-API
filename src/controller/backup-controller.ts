import ExcelJS from "exceljs";
import { ENGG_RECORD, PUC_RECORD } from "../models";
import axios from "axios";
import {
  Engg_Record,
  Remedial_Details,
  Remedial_Sem_Details,
  Sem_Details,
  Subject,
} from "../types/engg";
import { Puc_Record } from "../types/puc";

const EnggExportToExcel = async (data: any, sheetName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = [
    { header: "REGULATION", key: "REGULATION" },
    { header: "ID", key: "ID" },
    { header: "SNAME", key: "SNAME" },
    { header: "FNAME", key: "FNAME" },
    { header: "DOB", key: "DOB" },
    {
      header: "CONSOLIDATE_CERTIFICATE_NO",
      key: "CONSOLIDATE_CERTIFICATE_NO",
    },
    {
      header: "PROVISIONAL_CERTIFICATE_NO",
      key: "PROVISIONAL_CERTIFICATE_NO",
    },
    {
      header: "ORIGINAL_DEGREE_CERTIFICATE_NO",
      key: "ORIGINAL_DEGREE_CERTIFICATE_NO",
    },
    { header: "ISSUED_SEM_CARDS_NUMBER", key: "ISSUED_SEM_CARDS_NUMBER" },
    { header: "SEM", key: "SEM" },
    { header: "SGPA", key: "SGPA" },
    { header: "CGPA", key: "CGPA" },
    { header: "TCR", key: "TCR" },
    { header: "PNO", key: "PNO" },
    { header: "PCODE", key: "PCODE" },
    { header: "PNAME", key: "PNAME" },
    { header: "CR", key: "CR" },
    { header: "GR", key: "GR" },
    { header: "GRPTS", key: "GRPTS" },
    { header: "TGRP", key: "TGRP" },
    { header: "ATTEMPT", key: "ATTEMPT" },
    { header: "DOJ", key: "DOJ" },
    { header: "EXAMMY", key: "EXAMMY" },
  ];

  data.forEach((student: Engg_Record) => {
    student.ENGG_RECORDS.forEach((sem: Sem_Details) => {
      sem.SUBJECTS.forEach((sub: Subject) => {
        worksheet.addRow({
          REGULATION: student.REGULATION,
          ID: student.ID,
          SNAME: student.SNAME,
          FNAME: student.FNAME,
          DOB: student.DOB,
          DOJ: student.DOJ,
          CONSOLIDATE_CERTIFICATE_NO: student.CONSOLIDATE_CERTIFICATE_NO,
          PROVISIONAL_CERTIFICATE_NO: student.PROVISIONAL_CERTIFICATE_NO,
          ORIGINAL_DEGREE_CERTIFICATE_NO:
            student.ORIGINAL_DEGREE_CERTIFICATE_NO,
          ISSUED_SEM_CARDS_NUMBER: student.ISSUED_SEM_CARDS_NUMBER,
          SEM: sem.SEM,
          SGPA: sem.SGPA,
          CGPA: sem.CGPA,
          TCR: sem.TCR,
          PNO: sub.PNO,
          PCODE: sub.PCODE,
          PNAME: sub.PNAME,
          EXAMMY: sub.EXAMMY,
          CR: sub.CR,
          GR: sub.GR,
          GRPTS: sub.GRPTS,
          TGRP: sub.TGRP,
          ATTEMPT: sub.ATTEMPT,
        });
      });
    });
    student.REMEDIAL_RECORDS.forEach((sem: Remedial_Details) => {
      sem.REMEDIAL_DATES.forEach((date: Remedial_Sem_Details) => {
        date.SUBJECTS.forEach((sub: Subject) => {
          worksheet.addRow({
            REGULATION: student.REGULATION,
            ID: student.ID,
            SNAME: student.SNAME,
            FNAME: student.FNAME,
            DOB: student.DOB,
            DOJ: student.DOJ,
            CONSOLIDATE_CERTIFICATE_NO: student.CONSOLIDATE_CERTIFICATE_NO,
            PROVISIONAL_CERTIFICATE_NO: student.PROVISIONAL_CERTIFICATE_NO,
            ORIGINAL_DEGREE_CERTIFICATE_NO:
              student.ORIGINAL_DEGREE_CERTIFICATE_NO,
            ISSUED_SEM_CARDS_NUMBER: student.ISSUED_SEM_CARDS_NUMBER,
            SEM: sem.SEM,
            SGPA: date.SGPA,
            CGPA: date.CGPA,
            TCR: sem.TCR,
            PNO: sub.PNO,
            PCODE: sub.PCODE,
            PNAME: sub.PNAME,
            EXAMMY: sub.EXAMMY,
            CR: sub.CR,
            GR: sub.GR,
            GRPTS: sub.GRPTS,
            TGRP: sub.TGRP,
            ATTEMPT: sub.ATTEMPT,
          });
        });
      });
    });
  });
  // Generate buffer
  return await workbook.xlsx.writeBuffer();
};

const PucExportToExcel = async (data: any, sheetName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = [
    { header: "REGULATION", key: "REGULATION" },
    { header: "ID", key: "ID" },
    { header: "SNAME", key: "SNAME" },
    { header: "FNAME", key: "FNAME" },
    { header: "GRP", key: "GRP" },
    { header: "CERTIFICATE_NUMBER", key: "CERTIFICATE_NUMBER" },
    { header: "YEAR_SEM", key: "YEAR_SEM" },
    { header: "SEM_NO", key: "SEM_NO" },
    { header: "SEMCR", key: "SEMCR" },
    { header: "PNO", key: "PNO" },
    { header: "PCODE", key: "PCODE" },
    { header: "PNAME", key: "PNAME" },
    { header: "CCMY", key: "CCMY" },
    { header: "CR", key: "CR" },
    { header: "GR", key: "GR" },
    { header: "GRPTS", key: "GRPTS" },
    { header: "TGRP", key: "TGRP" },
    { header: "ATTEMPT", key: "ATTEMPT" },
    { header: "TOTAL_ATTEMPTS", key: "ATTEMPTS" },
  ];

  data.forEach((student: Puc_Record) => {
    student.PUC_RECORDS.forEach((sem) => {
      sem.SUBJECTS.forEach((sub) => {
        worksheet.addRow({
          REGULATION: student.REGULATION,
          ID: student.ID,
          SNAME: student.SNAME,
          FNAME: student.FNAME,
          GRP: student.GRP,
          CERTIFICATE_NUMBER: student.CERTIFICATE_NUMBER,
          YEAR_SEM: sem.YEAR_SEM,
          SEM_NO: sem.SEM_NO,
          SEMCR: sem.SEMCR,
          PNO: sub.PNO,
          PCODE: sub.PCODE,
          PNAME: sub.PNAME,
          CCMY: sub.CCMY,
          CR: sub.CR,
          GR: sub.GR,
          GRPTS: sub.GRPTS,
          TGRP: sub.TGRP,
          ATTEMPT: sub.ATTEMPT,
          TOTAL_ATTEMPTS: sub.TOTAL_ATTEMPTS,
        });
      });
    });
    student.REMEDIAL_RECORDS.forEach((record) => {
      worksheet.addRow({
        REGULATION: student.REGULATION,
        ID: student.ID,
        SNAME: student.SNAME,
        FNAME: student.FNAME,
        GRP: student.GRP,
        CERTIFICATE_NUMBER: student.CERTIFICATE_NUMBER,
        YEAR_SEM: record.YEAR_SEM,
        SEM_NO: record.SEM_NO,
        SEMCR: record.SEMCR,
        PNO: record.PNO,
        PCODE: record.PCODE,
        PNAME: record.PNAME,
        CCMY: record.CCMY,
        CR: record.CR,
        GR: record.GR,
        GRPTS: record.GRPTS,
        TGRP: record.TGRP,
        ATTEMPT: record.ATTEMPT,
        TOTAL_ATTEMPTS: record.TOTAL_ATTEMPTS,
      });
    });
  });
  // Generate buffer
  return await workbook.xlsx.writeBuffer();
};
const BackupController = {
  async enggBackup(req: any, res: any) {
    try {
      const engg_data = await ENGG_RECORD.find({});
      const buffer = await EnggExportToExcel(engg_data, "Engg");

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Engg_Backup_${Date.now()}.xlsx`
      );
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: "Failed to Backup the data" });
    }
  },
  async pucBackup(req: any, res: any) {
    try {
      const puc_data = await PUC_RECORD.find({});
      const buffer = await PucExportToExcel(puc_data, "Puc");

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Puc_Backup_${Date.now()}.xlsx`
      );

      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: "Failed to Backup the data" });
    }
  },
};

export default BackupController;
