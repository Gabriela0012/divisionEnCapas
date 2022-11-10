import { Router } from 'express'
import viewsController from '../controllers/views.controller.js'


const router = Router()

router.get('/', viewsController.home)


export default router