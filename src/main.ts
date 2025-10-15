import "./style.css";
import { initTodoApp } from "./app";

/**
 * Application Entry Point
 * Simplified functional approach - no classes needed!
 */
initTodoApp().catch((error) => {
  console.error("Failed to initialize app:", error);
});
