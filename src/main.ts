import "./style.css";
import { TodoAppController } from "./controllers/TodoAppController";

/**
 * Application Entry Point
 * Follows Clean Code and SOLID principles
 */
async function bootstrap(): Promise<void> {
  try {
    const app = new TodoAppController();
    await app.initialize();
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
}

// Start the application
bootstrap();
