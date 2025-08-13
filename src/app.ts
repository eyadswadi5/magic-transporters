import express from 'express';
import router from './routes/api';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';

const app = express();

app.use(express.json())

app.use('/api', router)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;