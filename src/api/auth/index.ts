import * as express from 'express';

import { googleLogin, googleLoginCallback, publishTokens } from './auth.ctrl';

const router = express.Router();

router.get('/google', googleLogin);
router.get('/google/callback', googleLoginCallback);
router.get('/publishTokens', publishTokens)

export default router;