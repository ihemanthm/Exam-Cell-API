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

// Define the Record interface
interface PUCRecord extends Document {
  REGULATION: string;
  SNAME: string;
  FNAME: string;
  ID: string;
  GRP: string;
  CERTIFICATE_NUMBER:string,
  TOTAL_REMS: number;
  CURRENT_REMS: number;
  PUC_RECORDS: Sem_Details[];
}

// Define the Mongoose schema for Record
const pucRecordSchema: Schema<PUCRecord> = new mongoose.Schema({
  REGULATION: { type: String },
  SNAME: { type: String },
  FNAME: { type: String },
  ID: { type: String, unique: true, required: true },
  GRP: { type: String },
  CERTIFICATE_NUMBER:{type:String},
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
        },
      ],
    },
  ],
});

// Create the Record model
const PUC_RECORD = mongoose.model<PUCRecord>("PUC_Record", pucRecordSchema);

export default PUC_RECORD;
