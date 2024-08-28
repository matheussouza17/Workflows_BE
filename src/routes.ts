import { Router } from "express";
import multer from 'multer';
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { UpdateUserController } from "./controllers/user/UpdateUserController";
import { UpsertDepartmentController } from "./controllers/department/UpsertDepartmentController";
import { GetDepartmentController } from "./controllers/department/GetDepartmentController";
import { UpsertCategoryController } from "./controllers/category/UpsertCategoryController";
import { UpsertApprovalController } from "./controllers/approval/UpsertApprovalController";
import { UpsertProcessController } from "./controllers/process/UpsertProcessController";
import { UpsertActivityLogController } from "./controllers/activity/UpsertActivityLogController";
import { UpsertNotificationController } from "./controllers/notification/UpsertNotificationController";
import { isAuthenticated } from './middlewares/isAuthenticated';

const router = Router();
const upload = multer(); // Configuração básica do multer para lidar com uploads de arquivos em memória

// ROTAS USER
router.post('/users', upload.single('file'), new CreateUserController().handle);
router.post('/session', new AuthUserController().handle);
router.get('/me', isAuthenticated, new DetailUserController().handle);
router.put('/users/:id', isAuthenticated, upload.single('file'), new UpdateUserController().handle);

// ROTAS DEPARTMENT
router.post('/departments', isAuthenticated, new UpsertDepartmentController().handle);
router.put('/departments/:id', isAuthenticated, new UpsertDepartmentController().handle);
router.get('/departments/:id?/:code?', isAuthenticated, new GetDepartmentController().handle);

// ROTAS CATEGORY
router.post('/categories', isAuthenticated, new UpsertCategoryController().handle);
router.put('/categories/:id', isAuthenticated, new UpsertCategoryController().handle);

// ROTAS APPROVAL
router.post('/approvals', isAuthenticated, new UpsertApprovalController().handle);
router.put('/approvals/:id', isAuthenticated, new UpsertApprovalController().handle);

// ROTAS PROCESS
router.post('/processes', isAuthenticated, new UpsertProcessController().handle);
router.put('/processes/:id', isAuthenticated, new UpsertProcessController().handle);

// ROTAS ACTIVITY LOG
router.post('/activity-logs', isAuthenticated, new UpsertActivityLogController().handle);
router.put('/activity-logs/:id', isAuthenticated, new UpsertActivityLogController().handle);

// ROTAS NOTIFICATION
router.post('/notifications', isAuthenticated, new UpsertNotificationController().handle);
router.put('/notifications/:id', isAuthenticated, new UpsertNotificationController().handle);

export { router };
