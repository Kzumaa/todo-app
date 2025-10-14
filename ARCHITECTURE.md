# Clean Code & SOLID Principles - Architecture Documentation

This document explains the refactored architecture following Clean Code conventions and SOLID principles.

## 📐 Architecture Overview

```
src/
├── main.ts                      # Application entry point
├── controllers/                 # Application controllers
│   └── TodoAppController.ts    # Main app orchestrator
├── services/                    # Business logic layer
│   ├── http.ts                 # HTTP client (SRP)
│   ├── todoService.ts          # Todo business logic (SRP)
│   └── todoFilterService.ts    # Filtering logic (SRP)
├── repositories/                # Data access layer
│   └── todoRepository.ts       # API repository pattern
├── components/                  # UI components
│   ├── TodoCard.ts             # Single todo card (SRP)
│   ├── TodoList.ts             # List of todos (SRP)
│   ├── EditModal.ts            # Edit modal (SRP)
│   └── Pagination.ts           # Pagination controls (SRP)
├── mappers/                     # Data transformation
│   └── todoMapper.ts           # DTO ↔ Domain mapping
├── types/                       # Type definitions
│   ├── todo.ts                 # Domain model
│   └── api.ts                  # API DTOs
└── utils/                       # Utility functions
    └── uiHelpers.ts            # UI helper functions
```

## 🎯 SOLID Principles Applied

### 1. **Single Responsibility Principle (SRP)**

Each class/module has ONE reason to change:

#### ✅ Before vs After

**Before (Violates SRP):**

```typescript
// TodoService did EVERYTHING:
// - HTTP calls
// - Data transformation
// - Filtering
// - Business logic
```

**After (Follows SRP):**

```typescript
HttpClient        → Only HTTP communication
TodoApiRepository → Only API data access
TodoMapper        → Only data transformation
TodoService       → Only business logic
TodoFilterService → Only filtering logic
TodoCardComponent → Only rendering a card
```

### 2. **Open/Closed Principle (OCP)**

Classes are open for extension but closed for modification:

```typescript
// HttpClient can be extended for different APIs
export class HttpClient {
  constructor(baseURL: string) {
    /* ... */
  }
}

// TodoService accepts repository via dependency injection
export class TodoService {
  constructor(repository?: TodoApiRepository) {
    this.repository = repository || new TodoApiRepository();
  }
}
```

### 3. **Dependency Inversion Principle (DIP)**

High-level modules don't depend on low-level modules:

```typescript
// Controller depends on abstractions (interfaces), not concrete implementations
export class TodoAppController {
  private todoService: TodoService;
  private filterService: TodoFilterService;

  constructor() {
    // Dependencies injected, can be swapped with mocks for testing
    this.todoService = new TodoService();
    this.filterService = new TodoFilterService();
  }
}
```

## 🏗️ Layered Architecture

### Layer 1: Presentation Layer (UI Components)

- **Responsibility**: Render UI elements
- **Files**: `components/*.ts`
- **Dependencies**: None (Pure UI logic)

```typescript
TodoCardComponent → Creates a single todo card
TodoListComponent → Renders a list of cards
EditModalComponent → Manages modal display
PaginationComponent → Handles pagination UI
```

### Layer 2: Application Layer (Controllers)

- **Responsibility**: Orchestrate user interactions
- **Files**: `controllers/TodoAppController.ts`
- **Dependencies**: Services, Components

```typescript
TodoAppController
├── Handles user events
├── Coordinates services
├── Updates UI
└── Manages application state
```

### Layer 3: Business Logic Layer (Services)

- **Responsibility**: Business rules and logic
- **Files**: `services/*.ts`
- **Dependencies**: Repositories, Mappers

```typescript
TodoService → CRUD operations, business rules
TodoFilterService → Filtering and categorization
HttpClient → HTTP communication abstraction
```

### Layer 4: Data Access Layer (Repositories)

- **Responsibility**: External data communication
- **Files**: `repositories/todoRepository.ts`
- **Dependencies**: HttpClient

```typescript
TodoApiRepository → API calls (CRUD)
```

### Layer 5: Data Transfer Layer (Mappers & DTOs)

- **Responsibility**: Transform data between layers
- **Files**: `mappers/todoMapper.ts`, `types/api.ts`

```typescript
TodoMapper → Converts between DTOs and Domain models
TodoDTO → API data structure
Todo → Domain model (business logic)
```

## 📦 Key Design Patterns

### 1. Repository Pattern

Abstracts data access:

```typescript
export class TodoApiRepository {
  async findAll(): Promise<TodoDTO[]>;
  async findById(id: number): Promise<TodoDTO>;
  async create(data: Partial<TodoDTO>): Promise<TodoDTO>;
  async update(id: number, data: Partial<TodoDTO>): Promise<TodoDTO>;
  async delete(id: number): Promise<void>;
}
```

### 2. Mapper Pattern

Separates domain models from DTOs:

```typescript
export class TodoMapper {
  static toDomain(dto: TodoDTO): Todo
  static toDTO(todo: Todo): TodoDTO
  static toCreateDTO(...): CreateTodoDTO
  static toUpdateDTO(...): UpdateTodoDTO
}
```

### 3. Controller Pattern

Orchestrates application flow:

```typescript
export class TodoAppController {
  // Coordinates all components and services
  async initialize(): Promise<void>;
  private setupEventListeners(): void;
  private async render(): Promise<void>;
}
```

### 4. Dependency Injection

Services receive dependencies:

```typescript
// Service can accept different repositories for testing
constructor(repository?: TodoApiRepository) {
  this.repository = repository || new TodoApiRepository();
}
```

## 🎨 Clean Code Practices

### 1. **Meaningful Names**

```typescript
// ✅ Good
async findAll(): Promise<TodoDTO[]>
async getTodos(): Promise<Todo[]>

// ❌ Bad
async get(): Promise<any>
async getData(): Promise<any>
```

### 2. **Small Functions**

Each function does ONE thing:

```typescript
// ✅ Good - Single responsibility
private getCompleted(todos: Todo[]): Todo[] {
  return todos.filter((todo) => todo.completed);
}

private getOverdue(todos: Todo[], now: Date): Todo[] {
  return todos.filter(
    (todo) => !todo.completed && todo.dueDate && new Date(todo.dueDate) < now
  );
}
```

### 3. **No Magic Numbers**

```typescript
// State is clearly defined
interface AppState {
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  statusFilter: TodoStatus;
}
```

### 4. **Error Handling**

Consistent error handling:

```typescript
async findById(id: number): Promise<Todo | undefined> {
  try {
    const dto = await this.repository.findById(id);
    return TodoMapper.toDomain(dto);
  } catch (error) {
    console.error(`Todo with id ${id} not found`);
    return undefined;
  }
}
```

## 🔄 Data Flow

```
User Interaction
    ↓
Controller (TodoAppController)
    ↓
Service (TodoService)
    ↓
Repository (TodoApiRepository)
    ↓
HTTP Client (HttpClient)
    ↓
API (json-server)
    ↓
Response (TodoDTO)
    ↓
Mapper (TodoMapper) → Domain Model (Todo)
    ↓
Controller
    ↓
Component (TodoListComponent)
    ↓
UI Update
```

## 🧪 Benefits of This Architecture

### 1. **Testability**

Each layer can be tested independently:

```typescript
// Mock repository for service testing
const mockRepo = new MockTodoRepository();
const service = new TodoService(mockRepo);
```

### 2. **Maintainability**

- Easy to find and fix bugs
- Changes are isolated to specific layers
- Clear separation of concerns

### 3. **Scalability**

- Easy to add new features
- Can swap implementations (e.g., different API)
- Components are reusable

### 4. **Readability**

- Clear structure and organization
- Self-documenting code
- Consistent patterns

## 🚀 Future Improvements

1. **Add Interfaces**: Define contracts for services
2. **Add Validators**: Validate input data
3. **Add Error Boundaries**: Better error handling
4. **Add Loading States**: Show loading indicators
5. **Add Unit Tests**: Test each layer independently
6. **Add State Management**: Use a state management library
7. **Add Caching**: Cache API responses

## 📝 Summary

This refactoring demonstrates:

- ✅ Single Responsibility Principle
- ✅ Open/Closed Principle
- ✅ Dependency Inversion Principle
- ✅ Clean Code practices
- ✅ Layered architecture
- ✅ Design patterns (Repository, Mapper, Controller)
- ✅ Separation of concerns
- ✅ Testability and maintainability
