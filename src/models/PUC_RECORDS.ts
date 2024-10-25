import mongoose, { Document, Schema } from "mongoose";

// Define the Subject interface
interface Subject {
  PNO: number;
  PCODE: string;
  PNAME: string;
  CR: number;
  GR: string;
  GRPTS: number;
  TGRP: number;
  CCMY: Date;
  ATTEMPT: string;
  TOTAL_ATTEMPTS: number;
}

// Define the RecordEntry interface
interface Sem_Details {
  YEAR_SEM: string;
  SEM_NO: number;
  SEMCR: number;
  TOTAL_REMS: number;
  CURRENT_REMS: number;
  SUBJECTS: Subject[];
}

interface Remedial_Records {
  YEAR_SEM: string;
  SEM_NO: number;
  SEMCR: number;
  PNO: number;
  PCODE: string;
  PNAME: string;
  CR: number;
  GR: string;
  GRPTS: number;
  TGRP: number;
  CCMY: Date;
  ATTEMPT: string;
  TOTAL_ATTEMPT:number;
}

// Define the Record interface
interface Puc_Record extends Document {
  REGULATION: string;
  SNAME: string;
  FNAME: string;
  ID: string;
  GRP: string;
  CERTIFICATE_NUMBER: string;
  TOTAL_REMS: number;
  CURRENT_REMS: number;
  PUC_RECORDS: Sem_Details[];
  REMEDIAL_RECORDS: Remedial_Records[];
}

// Define the Mongoose schema for Record
const pucRecordSchema: Schema<Puc_Record> = new mongoose.Schema({
  REGULATION: { type: String },
  SNAME: { type: String },
  FNAME: { type: String },
  ID: { type: String, unique: true, required: true },
  GRP: { type: String },
  CERTIFICATE_NUMBER: { type: String },
  TOTAL_REMS: { type: Number },
  CURRENT_REMS: { type: Number },
  PUC_RECORDS: [
    {
      YEAR_SEM: { type: String },
      SEM_NO: { type: Number },
      SEMCR: { type: Number },
      SEM_TOTAL_REMS: { type: Number },
      SEM_CURRENT_REMS: { type: Number },
      SUBJECTS: [
        {
          PNO: { type: Number },
          PCODE: { type: String },
          PNAME: { type: String },
          CCMY: { type: Date },
          CR: { type: Number },
          GR: { type: String },
          GRPTS: { type: Number },
          TGRP: { type: Number },
          ATTEMPT: { type: String },
          TOTAL_ATTEMPTS: { type: Number },
        },
      ],
    },
  ],
  REMEDIAL_RECORDS: [
    {
      YEAR_SEM: { type: String },
      SEM_NO: { type: Number },
      SEMCR: { type: Number },
      PNO: { type: Number },
      PCODE: { type: String },
      PNAME: { type: String },
      CR: { type: Number },
      GR: { type: String },
      GRPTS: { type: Number },
      TGRP: { type: Number },
      CCMY: { type: Date },
      ATTEMPT: { type: String },
      TOTAL_ATTEMPTS:{type:Number},
    },
  ],
});

// Create the Record model
const PUC_RECORD = mongoose.model<Puc_Record>("PUC_Record", pucRecordSchema);

export default PUC_RECORD;
