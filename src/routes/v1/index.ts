import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { excelController ,studentController,imagesController} from '../../controller/index';  // Ensure correct path

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const folder=file.fieldname==='zip'?'uploads/images':"uploads/files";
    cb(null, folder);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), excelController.uploadExcel);
router.post('/uploadImages',upload.single('zip'),imagesController.uploadImages);
router.get('/getStudentImage/:id',async(req:Request,res:Response)=>
{
  const response=await imagesController.getImageById(req,res);
  res.send(response);
})
router.get('/getStudentById/:id', async (req: Request, res: Response) => {
 try{
  const response =await studentController.getStudentById(req, res);
  return res.send(response);
 }catch(error)
 {
  res.status(500).send(error);
 }
});

router.get('/getAllStudentsByBatch/:batch',async(req:Request,res:Response)=>
  {
    const response=await studentController.getAllStudentsByBatch(req,res);
    if(!response)
    {
      return res.status(404).json({"message" : "Batch not found"});
    }
    return res.status(200).send(response);
  })

export default router;
