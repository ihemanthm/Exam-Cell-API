import {Users} from '../models/index';
import CrudRepository from './crud-repository';

const UserRepository=
{
    async singUp(data:{email:string,name:string,password:string})
    {
        try
        {
            const response=await CrudRepository.create(Users,data);
            return response;
        }catch(error)
        {
            return error;
        }
    },
    async getUserByEmail(email:string)
    {
        try
        {
            const response=await CrudRepository.findBy(Users,{email});
            return response;
        }catch(error)
        {
            return error;
        }
        
    }
};

export default UserRepository;