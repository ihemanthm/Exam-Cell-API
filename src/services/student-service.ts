import { StudentRepository } from "../repository";
import { Engg_Record } from "../types/engg";

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
};

export default studentServices;
