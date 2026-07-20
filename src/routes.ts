import { Router } from "express"
import * as controller from './controllers/controller-api' 

const router =  Router()

router.get('/filter', controller.produtosFiltradosController)
router.get('/tables', controller.getTables)
router.get('/:tables', controller.genericDataController)

export default router