import * as express from 'express';

import { googleLogin, googleLoginCallback } from './auth.ctrl';

const router = express.Router();

router.get('/google', googleLogin);
router.get('/google/callback', googleLoginCallback);

export default router;