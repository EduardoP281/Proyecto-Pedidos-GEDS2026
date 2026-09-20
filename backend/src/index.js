import { createApp } from './app.js';
import { config } from './config/environment.js';

const app = createApp();

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Servidor backend corriendo en http://localhost:${config.port}`);
});
