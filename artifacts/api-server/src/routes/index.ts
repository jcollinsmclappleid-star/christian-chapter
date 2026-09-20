import { Router, type IRouter } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
// Note: founding-member admin routes will be added in Task #8
// once authentication/authorisation is in place (PII protection).

export default router;
