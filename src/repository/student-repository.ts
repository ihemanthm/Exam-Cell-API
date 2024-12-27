import CrudRepository from "./crud-repository";
import { PUC_RECORD, ENGG_RECORD } from "../models/index";
import { Engg_Record } from "../types/engg";
import { Puc_Record } from "../types/puc";
const StudentRepository = {

  async getPUCDetails(data: string):Promise<Puc_Record | null | undefined> {

    try {
      const response: Puc_Record | null | undefined = await CrudRepository.Puc_findBy(PUC_RECORD, { ID: data });
      return response;
    } catch (error) {
      throw error
    }
  },

  async getEnggDetails(data: string): Promise<Engg_Record | null | undefined>{

    try {
      const response:Engg_Record | null | undefined= await CrudRepository.Engg_findBy(ENGG_RECORD, { ID: data });
      return response;
    } catch (error) {
      throw error
    }
  },

  async getPUCDetailsByBatch(batch: String) {

    try {
      const response = await CrudRepository.findAllBy(PUC_RECORD, batch);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getEnggDetailsByBatch(batch: String) {

    try {
      const response = await CrudRepository.findAllBy(ENGG_RECORD, batch);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getRankListByBatch(batch: string) {

    try {
      const response = await CrudRepository.findAllByBatchAndSort(
        ENGG_RECORD,
        batch
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  
};

export default StudentRepository;
