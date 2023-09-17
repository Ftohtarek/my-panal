import { Router } from 'express'
import upload from './upload-image.routes';
import json from './update-json.routes';

const router = Router();

router.use('/', upload);
router.use('/', json);

export default router;
