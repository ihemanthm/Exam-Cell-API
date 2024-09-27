import express, { Request, response, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { pucExcelController,enggExcelController ,studentController,imagesController,userController,certificateController} from '../../controller/index'; 

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const folder=file.fieldname==='zip'?'uploads/images':file.fieldname==='puc'?"uploads/puc":'uploads/engg';
    cb(null, folder);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
//PUC Routes
router.post('/uploadPUCFiles', upload.single('puc'), pucExcelController.uploadExcel);
router.get('/getPUCDetails/:id', studentController.getPUCDetails);
router.get('/getPUCDetailsByBatch/:batch',studentController.getPUCDetailsByBatch);


//Engineering Routes
router.post('/uploadEnggFiles', upload.single('engg'), enggExcelController.uploadExcel);
router.get('/getEnggDetails/:id',studentController.getEnggDetails);
router.get('/getEnggDetailsByBatch/:batch',studentController.getEnggDetailsByBatch);


//student images Routes
router.post('/uploadImages',upload.single('zip'),imagesController.uploadImages);
router.get('/getStudentImage/:id',imagesController.getImageById);


//CertificateRoutes
router.put('/update/PUCCertificateDate',certificateController.updatePUCIssuedDate);
router.put('/update/EnggCertificateDate',certificateController.updateEnggIssuedDate);


//Authentication Routes
router.post('/signup',userController.singUp);
router.post('/login',userController.login);
export default router;
