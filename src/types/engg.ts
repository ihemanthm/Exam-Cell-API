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
    EXAMMY: Date | null;
  }
  
  //define entities of Subject
  export interface Subject {
    PNO: number;
    PCODE: string;
    PNAME: string;
    CR: number;
    GR: string;
    GRPTS: number;
    TGRP: number;
    ATTEMPT: string;
    EXAMMY: Date | null;
  }
  
  //define entities of Record
  export interface Sem_Details {
    SEM: number;
    SGPA: number;
    CGPA: number;
    TCR: number;
    SEM_TOTAL_REMS: number;
    SEM_CURRENT_REMS: number;
    SUBJECTS: Subject[];
  }
  
  //Deifne Current_Remedials
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
  
  // define entities of ENGG_RECORD
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
    REMEDIAL_RECORDS: Sem_Details[];
    CURRENT_REMEDIALS: Current_Remedials[];
  }