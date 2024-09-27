import { PUC_RECORD,ENGG_RECORD } from "../models/index";
import CrudRepository from "./crud-repository";
const certificateRepository={
    async updatePUCIssuedDate(data:any)
    {
        return await CrudRepository.update(PUC_RECORD,data);
    },
    async updateEnggIssuedDate(data:any)
    {
        return await CrudRepository.update(ENGG_RECORD,data);
    }
}


export default certificateRepository;