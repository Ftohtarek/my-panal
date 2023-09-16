
// routes/index.ts
// import { Router } from 'express';

import upload from './upload-image.routes.ts';
import json from './update-json.routes';
Router = require('express').Router;
const router = Router();

router.use('/', upload);
router.use('/', json);

export default router;
