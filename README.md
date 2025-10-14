# Todo List App with JSON Server

A modern todo list web application built with TypeScript, Vite, and JSON Server for API simulation.

## Features

- ✅ Add, edit, and delete todos
- 🔍 Search todos by title
- 🎯 Filter by status (All, Completed, Overdue, Normal)
- 📄 Pagination support
- 📅 Optional due date tracking
- 🎨 Beautiful three-column layout (Completed, Active, Overdue)
- 💾 Persistent data with JSON Server

## Setup & Installation

1. **Install dependencies** (already done):

   ```bash
   npm install
   ```

2. **Running the application**:

   You have two options:

   ### Option 1: Run frontend and backend separately

   **Terminal 1** - Start JSON Server (backend):

   ```bash
   npm run server
   ```

   This starts the API server on http://localhost:3000

   **Terminal 2** - Start Vite dev server (frontend):

   ```bash
   npm run dev
   ```

   This starts the frontend on http://localhost:5173

   ### Option 2: Run both together (Windows users may need separate terminals)

   ```bash
   npm run dev:all
   ```

3. **Open your browser** and navigate to:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000/todos

## API Endpoints

The JSON Server provides RESTful API endpoints:

- `GET /todos` - Get all todos
- `GET /todos/:id` - Get a specific todo
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

## Sample Data

The app comes with 12 sample todos in `db.json` including:

- Completed todos
- Active todos
- Overdue todos
- Todos without due dates

## Project Structure

```
├── db.json                 # JSON Server database
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── src/
│   ├── main.ts            # Application entry point
│   ├── style.css          # Styles
│   ├── services/
│   │   └── todoService.ts # API service with axios
│   ├── types/
│   │   └── todo.ts        # TypeScript types
│   └── utils/
│       └── uiHelpers.ts   # UI helper functions
```

## Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **JSON Server** - Fake REST API for development
- **CSS3** - Modern styling with custom properties

## Notes

- The app uses `json-server` to simulate a backend API
- All data is stored in `db.json` and persists between sessions
- The frontend communicates with the API using axios
- Hot module replacement is enabled for fast development

## Development

### Adding new todos programmatically

You can add todos directly to `db.json` or use the API:

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Todo",
    "description": "Description here",
    "completed": false,
    "createdAt": "2025-10-15T12:00:00.000Z",
    "updatedAt": "2025-10-15T12:00:00.000Z",
    "dueDate": "2025-10-20T00:00:00.000Z"
  }'
```

### Resetting data

To reset the database, simply restart the json-server. Any changes made through the API will persist in `db.json`.

## Troubleshooting

- **Port already in use**: Change the port in package.json scripts
- **CORS issues**: JSON Server enables CORS by default
- **Connection refused**: Make sure json-server is running on port 3000

Enjoy building your todo list! 🚀
