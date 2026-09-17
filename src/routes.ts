import { Router } from "express"
import * as controller from './controllers/controller-api' 

const router =  Router()

router.get('/filter', controller.produtosFiltradosController)

router.get('/tables', controller.getTables)
router.get('/tables/:nameTable', controller.genericDataController)

router.get('/chamados', controller.getChamados)

router.post('/login', controller.postLogin)
router.get('/validation', controller.getValidation)

router.post('/contagem', controller.postContagem)

export default router