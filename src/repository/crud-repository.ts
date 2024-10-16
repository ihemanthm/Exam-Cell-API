import { Model } from "mongoose";
import { Response } from "express";
import { promises as fsPromises } from "fs";
import path from "path";
import {
  Engg_Record,
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
  
      // const sortedStudents = response.sort((a, b) => {
      //   const a_cgpa = calculateCGPA(a);
      //   const b_cgpa = calculateCGPA(b);
  
      //   // Handle potential NaN values or divide-by-zero errors
      //   if (isNaN(a_cgpa) || isNaN(b_cgpa)) {
      //     // Log or handle the error appropriately
      //     console.error("Error calculating CGPA for:", a, b);
      //     return 0; // Or handle the case as needed
      //   }
  
      //   return b_cgpa - a_cgpa; // Sort in descending order based on CGPA
      // });
      const sortedStudents=response.sort((a:Engg_Record,b:Engg_Record)=>{
        return b.TOTAL_REMS-a.TOTAL_REMS;
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

function calculateCGPA(student:Engg_Record) {
  // Implement your CGPA calculation logic here
  // Assuming you have properties like 'OBTAINED_CREDITS' and 'TOTAL_CREDITS'
  const totalCredits = student.TOTAL_CREDITS.reduce((acc, curr) => acc + curr, 0);
  const obtainedCredits = student.OBTAINED_CREDITS.reduce((acc, curr) => acc + curr, 0);

  if (totalCredits === 0) {
    return 0; // Handle the case of no credits
  }

  return obtainedCredits / totalCredits;
}
export default CrudRepository;
