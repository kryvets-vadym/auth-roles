import * as authController from '../controllers/authController';
import { Router } from 'express';
import { catchErrors } from '../helpers/catchErrors';
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post('/registration', catchErrors(authController.registration));
router.post('/login', catchErrors(authController.login));
router.post('/logout', catchErrors(authController.logout));
router.get('/activate/:link', catchErrors(authController.activate));
router.get('/refresh', catchErrors(authController.refresh));

router.get('/users',
  authMiddleware,
  catchErrors(authController.getUsers)
);

export default router;
