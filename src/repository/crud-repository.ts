import { Model } from "mongoose";
import { Response } from "express";
import { promises as fsPromises } from "fs";
import path from "path";
import {
  Engg_Record,
  Sem_Details,
} from "../types/engg"
import { Puc_Record } from "../types/puc";
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
  async Engg_findBy(model: Model<any>, data: {}): Promise<Engg_Record | null | undefined>{
    try {
      const response:Engg_Record | null= await model.findOne( {...data} );
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  async Puc_findBy(model: Model<any>, data: {}): Promise<Puc_Record | null | undefined>{
    try {
      const response:Puc_Record | null= await model.findOne( {...data} );
      return response;
    } catch (error) {
      console.log(error);
    }
  },
  async findBy(model: Model<any>, data: {}){
    try {
      const response= await model.findOne( {...data} );
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
        return response;
      }
      
      const sortedStudents = response.sort((a, b) => {
         return calculateCGPA(b) - calculateCGPA(a);
      });
      return sortedStudents;
    } catch (error:any) {
      console.log(error.message);
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
function calculateCGPA(a:Engg_Record):number{
  let a_obtainedCredits=0;
  let a_totalCredits=0;
  for(let i=0;i<8;i++){
    a_obtainedCredits+=a.OBTAINED_CREDITS[i];
    a_totalCredits+=a.TOTAL_CREDITS[i];
  }
  if(a_totalCredits===0){
    return 0;
  }
  return a_obtainedCredits/a_totalCredits;
}
export default CrudRepository;
