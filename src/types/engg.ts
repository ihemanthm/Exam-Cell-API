export interface Row_Data {
    REGULATION: string;
    ID: string;
    SNAME: string;
    FNAME: string;
    GRP: string;
    DOB: Date | null;
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
    DOJ: Date | null;
    EXAMMY: Date;
  }
  export interface Subject {
    PNO: number;
    PCODE: string;
    PNAME: string;
    CR: number;
    GR: string;
    GRPTS: number;
    TGRP: number;
    ATTEMPT: string;
  }
  export interface Sem_Details {
    SEM: number;
    SGPA: number;
    CGPA: number;
    TCR: number;
    OBTAINED_CR: number;
    EXAMMY:Date | null;
    SEM_TOTAL_REMS: number;
    SEM_CURRENT_REMS: number;
    SUBJECTS: Subject[];
  }
  export interface Remedial_Sem_Details{
    EXAMMY: Date;
    CGPA:number;
    SGPA:number;
    OBTAINED_CR:number;
    SUBJECTS: Subject[];
  }
  export interface Remedial_Details {
    SEM: number;
    SGPA: number;
    CGPA: number;
    TCR: number;
    SEM_TOTAL_REMS: number;
    SEM_CURRENT_REMS: number;
    REMEDIAL_DATES:Remedial_Sem_Details[];
  }
  export interface Current_Remedials {
    SEM: number;
    PNO: number;
    PCODE: string;
    PNAME: string;
    EXAMMY: Date | null;
    CR: number;
    GR: string;
    GRPTS: number;
    TGPR: number;
    TCR: number;
    ATTEMPTS: number;
  }
  export interface Engg_Record {
    REGULATION: string;
    ID: string;
    SNAME: string;
    FNAME: string;
    GRP: string;
    DOB: Date | null;
    DOJ: Date | null;
    CONSOLIDATE_CERTIFICATE_NO: string;
    PROVISIONAL_CERTIFICATE_NO: string;
    ORIGINAL_DEGREE_CERTIFICATE_NO: string;
    ISSUED_SEM_CARDS_NUMBER: number;
    TOTAL_REMS: number;
    CURRENT_REMS: number;
    OBTAINED_CREDITS:number[];
    TOTAL_CREDITS:number[];
    ENGG_RECORDS: Sem_Details[];
    REMEDIAL_RECORDS: Remedial_Details[];
    CURRENT_REMEDIALS: Current_Remedials[];
  }