import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js'

const router = Router();


router.post('/register',passport.authenticate('register',{successRedirect:'/login',failureRedirect: '/registerfail'}),sessionsController.register)







export default router