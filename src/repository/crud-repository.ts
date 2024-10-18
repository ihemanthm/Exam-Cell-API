import { Model } from "mongoose";
import { Response } from "express";
import { promises as fsPromises } from "fs";
import path from "path";
import {
  Engg_Record,
  Sem_Details,
} from "../types/engg"
var res: Response;
const CrudRepository = {
  async create(model: Model<any>, data: {}) {
    try {
      const result = await model.create(data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  async uploadExcel(model: Model<any>, data: {}) {
    try {
      const response = await model.create(data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  async findBy(model: Model<any>, data: {}) {
    try {
      const response = await model.findOne( {...data} );
      if (!response) {
        return null;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  async findAllBy(model: Model<any>, batch: String) {
    try {
      const response = await model.find({ REGULATION: batch });
      if (!response || response.length === 0) {
        return null;
      }
      return response;
    } catch (error) {
      console.log(error);
      return "An error occurred while fetching data";
    }
  },
  async findAllByBatchAndSort(model: Model<any>, batch: string) {
    try {
      const response = await model.find({ REGULATION: batch });
  
      if (!response || response.length === 0) {
        return null;
      }
      
      const sortedStudents = response.sort((a, b) => {
         const a_lastSem=a.ENGG_RECORDS.find((sem:Sem_Details)=> sem.SEM===8);
         const b_lastSem=b.ENGG_RECORDS.find((sem:Sem_Details)=> sem.SEM===8);
         if(!a_lastSem){
          return 1;
         }else if(!b_lastSem){
          return -1;
         }
         return b_lastSem.CGPA-a_lastSem.CGPA;
      });
      return sortedStudents;
    } catch (error) {
      console.log(error);
      return "An error occurred while fetching data";
    }
  },
  async imageBy(ID: string) {
    const filePath = path.join(__dirname, "../","../uploads/images/", `${ID}.png`);
    try {
      await fsPromises.access(filePath);
      return { image: `http://localhost:8000/uploads/images/${ID}` };
    } catch (error) {
      throw error;
    }
  },

  async update(model:Model<any>,data:{ ID: string, [key: string]: any })
  {
    const {ID,...updatedData}=data;
    try{
      const response=await model.findOneAndUpdate(
        {ID:ID},
        {$set:updatedData},
        {new:true,useFindAndModify:true});
      return response;
    }
    catch(error)
    {
      throw error;
    }
  },
};
export default CrudRepository;
