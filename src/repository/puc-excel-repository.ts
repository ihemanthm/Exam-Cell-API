import Record from '../models/PUC_RECORDS';
import CrudRepository from './crud-repository';
const pucExcelRepository={
    async uploadExcelFile(data:{})
    {
      return await CrudRepository.uploadExcel(Record,data);
    }
}

export default pucExcelRepository;