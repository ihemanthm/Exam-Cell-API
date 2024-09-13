import mongoose, { Document, Schema } from "mongoose";

// Define the Subject interface
interface Subject{
  PNO: number;
  PCODE:string,
  PNAME: string;
  CR: number;
  GR: string;
  GRPTS: number;
  TGRP: number;
  ATTEMPT: string;
  EXAMMY: Date;
}


// Define the RecordEntry interface

interface Sem_Details {
  SEM: number;
  SGPA: number;
  CGPA: number;
  TCR: number;
  SUBJECTS: Subject[];
}


// Define the Record interface

interface ENGGRecord extends Document {
  REGULATION: string;
  ID: string;
  SNAME: string;
  FNAME: string;
  GRP: string;
  DOB: Date;
  ENGG_RECORDS:Sem_Details[];
}


// Define the Mongoose schema for Record

const enggRecordSchema:Schema<ENGGRecord>=new mongoose.Schema(
    {
        REGULATION:{type:String},
        SNAME:{type:String},
        FNAME:{type:String},
        ID:{type:String,unique:true,required:true},
        GRP:{type:String},
        DOB:{type:Date},
        ENGG_RECORDS:[
            {
                SEM:{type:Number},
                SGPA:{type:Number},
                CGPA:{type:Number},
                TCR:{type:Number},
                SUBJECTS:[
                    {
                        PNO:{type:Number},
                        PCODE:{type:String},
                        PNAME:{type:String},
                        EXAMMY:{type:Date},
                        CR:{type:Number},
                        GR:{type:String},
                        GRPTS:{type:Number},
                        TGRP:{type:Number},
                        ATTEMPT:{type:String}
                    }
                ]
            }
        ]
    });



// Create the Record model
const ENGG_RECORD=mongoose.model<ENGGRecord>('ENGG_Record',enggRecordSchema);

export default ENGG_RECORD;