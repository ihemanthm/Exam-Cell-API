import CrudRepository from "./crud-repository";
import { PUC_RECORD, ENGG_RECORD } from "../models/index";
const StudentRepository = {
  async getPUCDetails(data: string) {
    try {
      const response = await CrudRepository.findBy(PUC_RECORD, { ID: data });
      return response;
    } catch (error) {
      return error;
    }
  },
  async getEnggDetails(data: string) {
    try {
      const response = await CrudRepository.findBy(ENGG_RECORD, { ID: data });
      return response;
    } catch (error) {
      return error;
    }
  },
  async getPUCDetailsByBatch(batch: String) {
    try {
      const response = await CrudRepository.findAllBy(PUC_RECORD, batch);
      return response;
    } catch (error) {
      return error;
    }
  },
  async getEnggDetailsByBatch(batch: String) {
    try {
      const response = await CrudRepository.findAllBy(ENGG_RECORD, batch);
      return response;
    } catch (error) {
      return error;
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
      return error;
    }
  },
};

export default StudentRepository;
