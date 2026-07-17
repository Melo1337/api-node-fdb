import { Router } from "express"
import * as controller from './controllers/controller-api' 

const router =  Router()

router.get('/filter', controller.produtosFiltradosController)
router.get('/admins', controller.genericDataController)
router.get('/clientes', controller.genericDataController)

export default router