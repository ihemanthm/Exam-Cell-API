import ENGG_RECORD from '../models/ENGG_RECORDS';
import CrudRepository from './crud-repository';
const enggExcelRepository={

    async uploadExcelFile(data:{}){
      
      return await CrudRepository.uploadExcel(ENGG_RECORD,data);
    }
}

export default enggExcelRepository;