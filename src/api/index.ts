import * as express from 'express';

import auth from './auth';

const router = express.Router();

router.use('/auth', auth);

router.get('/test', (req, res) => {
  console.log('> GET /test:', req.user)
  // res.cookie('accessToken', '', {
  //   maxAge: -1
  // })
  // res.cookie('tt', 'tt', {
  //   httpOnly: true,
  // })
  res.json({send: 'send'});
})


export default router;