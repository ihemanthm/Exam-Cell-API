import express from 'express';
import v1Routes from './v1/index';  // Ensure this path is correct and matches the TypeScript file

const router = express.Router();

router.use('/v1', v1Routes);

export default router;
