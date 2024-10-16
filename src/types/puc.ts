export interface Row_Data {
  REGULATION: string;
  SNAME: string;
  FNAME: string;
  ID: string;
  GRP: string;
  YEAR_SEM: string;
  SEM_NO: number;
  PNO: number;
  PCODE: string;
  PNAME: string;
  CR: number;
  GR: string;
  GRPTS: number;
  TGRP: number;
  CCMY: Date;
  ATTEMPT: string;
  SEMCR: number;
}

// define entities of each subject
export interface Subject {
  PNO: number;
  PCODE: string;
  PNAME: string;
  CR: number;
  GR: string;
  GRPTS: number;
  TGRP: number;
  ATTEMPT: string;
  CCMY: Date;
}

// define entities of each record
export interface Sem_Details {
  YEAR_SEM: string;
  SEMCR: number;
  SEM_NO: number;
  SEM_TOTAL_REMS: number;
  SEM_CURRENT_REMS: number;
  SUBJECTS: Subject[];
}

// define entities of each student
export interface Puc_Record{
  REGULATION: string;
  SNAME: string;
  FNAME: string;
  ID: string;
  GRP: string;
  TOTAL_REMS: number;
  CERTIFICATE_NUMBER: "";
  CURRENT_REMS: number;
  PUC_RECORDS: Sem_Details[];
}
