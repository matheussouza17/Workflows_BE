import { Router } from "express";
import multer from 'multer';
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { UpdateUserController } from "./controllers/user/UpdateUserController";
import { UpsertDepartmentController } from "./controllers/department/UpsertDepartmentController";
import { GetDepartmentController } from "./controllers/department/GetDepartmentController";
import { UpsertCategoryController } from "./controllers/category/UpsertCategoryController";
import { GetCategoryController } from "./controllers/category/GetCategoryController";
import { UpdateApprovalController } from "./controllers/approval/UpdateApprovalController";
import { CreateApprovalController } from "./controllers/approval/CreateApprovalController";
import { GetApprovalListController } from "./controllers/approval/GetApprovalListController";
import {GetApprovalDetailController} from './controllers/approval/GetApprovalDetailController'
import { UpdateProcessController } from "./controllers/process/UpdateProcessController";
import { UpsertActivityLogController } from "./controllers/activity/UpsertActivityLogController";
import { UpsertNotificationController } from "./controllers/notification/UpsertNotificationController";
import {GetActivityLogController} from './controllers/activity/GetActivityLogController'
import { isAuthenticated } from './middlewares/isAuthenticated';
import {GetUserController} from './controllers/user/GetUserController'

const router = Router();
const upload = multer(); // Configuração básica do multer para lidar com uploads de arquivos em memória

// ROTAS USER
router.post('/user', upload.single('file'), new CreateUserController().handle);
router.post('/session', new AuthUserController().handle);
router.get('/me', isAuthenticated, new DetailUserController().handle);
router.put('/user/:id', isAuthenticated, upload.single('file'), new UpdateUserController().handle);
router.get('/users', isAuthenticated, new GetUserController().handle);

// ROTAS DEPARTMENT
router.post('/department', isAuthenticated, new UpsertDepartmentController().handle);
router.put('/department/:id', isAuthenticated, new UpsertDepartmentController().handle);
router.get('/department/:id?/:code?', isAuthenticated, new GetDepartmentController().handle);

// ROTAS CATEGORY
router.post('/category', isAuthenticated, new UpsertCategoryController().handle);
router.put('/category/:id', isAuthenticated, new UpsertCategoryController().handle);
router.get('/category/:id?', isAuthenticated, new GetCategoryController().handle);

// ROTAS APPROVAL
router.post('/approval', isAuthenticated, new CreateApprovalController().handle);
router.put('/approval/:id', isAuthenticated, new UpdateApprovalController().handle);
router.get('/approvals/:name?:number?:categoryId?', isAuthenticated, new GetApprovalListController().handle);
router.get('/approval/:id?', isAuthenticated, new GetApprovalDetailController().handle);

// ROTAS PROCESS
router.post('/process', isAuthenticated, new UpdateProcessController().handle);
router.put('/process/', isAuthenticated, new UpdateProcessController().handle);

// ROTAS ACTIVITY LOG
//router.post('/activity-log', isAuthenticated, new UpsertActivityLogController().handle);
//router.put('/activity-log/:id', isAuthenticated, new UpsertActivityLogController().handle);
router.get('/activity-log/:processid?', isAuthenticated, new GetActivityLogController().handle);

// ROTAS NOTIFICATION
//router.post('/notification', isAuthenticated, new UpsertNotificationController().handle);
//router.put('/notification/:id', isAuthenticated, new UpsertNotificationController().handle);

export { router };
