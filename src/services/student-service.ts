import { StudentRepository } from "../repository";
import { ENGG_RECORD } from "../models";
import { Engg_Record, Sem_Details, Subject } from "../types/engg";

const studentServices = {
  async getPUCDetails(data: string) {
    try {
      const response = StudentRepository.getPUCDetails(data);
      return response;
    } catch (error) {
      return error;
    }
  },

  async getEnggDetails(data: string) {
    try {
      const response = StudentRepository.getEnggDetails(data);
      return response;
    } catch (error) {
      return error;
    }
  },
  async getPUCDetailsByBatch(batch: string) {
    try {
      const response = StudentRepository.getPUCDetailsByBatch(batch);
      return response;
    } catch (error) {
      return error;
    }
  },
  async getEnggDetailsByBatch(batch: string) {
    try {
      const response = StudentRepository.getEnggDetailsByBatch(batch);
      return response;
    } catch (error) {
      return error;
    }
  },
  async getRankListByBatch(batch: string) {
    try {
      const response = StudentRepository.getRankListByBatch(batch);
      console.log(response);
      return response;
    } catch (error) {
      console.log("Error fetching the Rank list", error);
      throw error;
    }
  },
  async updateCredits(ID: string): Promise<void> {
    try {
      // Fetch the student record
      const student = await this.getEnggDetails(ID);

      if (!student) {
        throw new Error("Student not found");
      }

      student.OBTAINED_CREDITS = new Array(8).fill(0);
      student.TOTAL_CREDITS = new Array(8).fill(0);
      student.ENGG_RECORDS.forEach((sem: Sem_Details) => {
        sem.SUBJECTS.forEach((sub: Subject) => {
          if (sem.SEM >= 1 && sem.SEM <= 8) {
            student.OBTAINED_CREDITS[sem.SEM - 1] += sub.TGRP || 0;
            student.TOTAL_CREDITS[sem.SEM - 1] += sub.CR || 0;
          }
        });
      });
      student.REMEDIAL_RECORDS.forEach((sem: Sem_Details) => {
        sem.SUBJECTS.forEach((sub: Subject) => {
          if (sem.SEM >= 1 && sem.SEM <= 8) {
            student.OBTAINED_CREDITS[sem.SEM - 1] += sub.TGRP || 0;
          }
        });
      });
      student.ENGG_RECORDS.forEach((sem:Sem_Details)=>{
        if(sem.SEM>=1 && sem.SEM<=8){
          
          //calculate SGPA for each sem
          if(student.TOTAL_CREDITS[sem.SEM-1]===0){
            sem.SGPA=0;
          }else{
            //round the value to 2 decimal places.
            sem.SGPA=parseFloat((student.OBTAINED_CREDITS[sem.SEM-1]/student.TOTAL_CREDITS[sem.SEM-1]).toFixed(2));
          }
          var obtained=0;
          var total=0;
          //calculate CGPA for each sem
          for(let i=0;i<sem.SEM;i++){
            obtained+=student.OBTAINED_CREDITS[i]
            total+=student.TOTAL_CREDITS[i]
          }
          if(total===0){
            sem.CGPA=0
          }else{
            //round the value to 2 decimal places
            sem.CGPA=parseFloat((obtained/total).toFixed(2));
          }
        }
      });
      student.REMEDIAL_RECORDS.forEach((sem:Sem_Details)=>{
        if(sem.SEM>=1 && sem.SEM<=8){
          
          //calculate SGPA for each sem
          if(student.TOTAL_CREDITS[sem.SEM-1]===0){
            sem.SGPA=0;
          }else{
            sem.SGPA=parseFloat((student.OBTAINED_CREDITS[sem.SEM-1]/student.TOTAL_CREDITS[sem.SEM-1]).toFixed(2));
          }
          var obtained=0;
          var total=0;
          //calculate CGPA for each sem
          for(let i=0;i<sem.SEM;i++){
            obtained+=student.OBTAINED_CREDITS[i]
            total+=student.TOTAL_CREDITS[i]
          }
          if(total===0){
            sem.CGPA=0
          }else{
            sem.CGPA=parseFloat((obtained/total).toFixed(2));
          }
        }
      });
      await student.save();
    } catch (error) {
      console.error("Error updating student credits:", error);
    }
  },
};

export default studentServices;
