import { Router } from "express";
import multer from 'multer';
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { UpdateUserController } from "./controllers/user/UpdateUserController";

const router = Router();
const upload = multer(); // Configuração básica do multer para lidar com uploads de arquivos em memória

//ROTAS USER
router.post('/users', upload.single('file'), new CreateUserController().handle); // Adicionando middleware multer
router.post('/session', new AuthUserController().handle);
router.get('/me', isAuthenticated, new DetailUserController().handle);
router.put('/users', isAuthenticated, upload.single('file'), new UpdateUserController().handle); 

export { router };
