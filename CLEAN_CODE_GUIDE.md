# Clean Code Refactoring - Quick Reference

## 🏗️ New Project Structure

```
src/
├── main.ts                          # 🚀 Entry point (15 lines)
│
├── controllers/                     # 🎮 Application Controllers
│   └── TodoAppController.ts        #    Orchestrates app flow
│
├── services/                        # 💼 Business Logic
│   ├── http.ts                     #    HTTP client
│   ├── todoService.ts              #    Todo business logic
│   ├── todoFilterService.ts        #    Filtering logic
│   └── todoApi.ts                  #    (Legacy, not used)
│
├── repositories/                    # 💾 Data Access
│   └── todoRepository.ts           #    API repository
│
├── mappers/                         # 🔄 Data Transformation
│   └── todoMapper.ts               #    DTO ↔ Domain mapper
│
├── components/                      # 🎨 UI Components
│   ├── TodoCard.ts                 #    Single card renderer
│   ├── TodoList.ts                 #    List renderer
│   ├── EditModal.ts                #    Modal manager
│   └── Pagination.ts               #    Pagination controls
│
├── types/                           # 📝 Type Definitions
│   ├── todo.ts                     #    Domain model
│   └── api.ts                      #    API DTOs
│
└── utils/                           # 🔧 Utilities
    └── uiHelpers.ts                #    (Deprecated)
```

## 🎯 SOLID Principles Quick Guide

### Single Responsibility Principle (SRP)

```
✅ One class = One responsibility

HttpClient         → HTTP communication only
TodoService        → Business logic only
TodoFilterService  → Filtering only
TodoCard           → Render one card only
```

### Open/Closed Principle (OCP)

```
✅ Open for extension, closed for modification

class HttpClient {
  constructor(baseURL: string) // Can extend with different URLs
}

class TodoService {
  constructor(repository?) // Can inject different repos
}
```

### Dependency Inversion Principle (DIP)

```
✅ Depend on abstractions, not concrete implementations

TodoAppController
    ↓ depends on
TodoService (interface/abstraction)
    ↓ depends on
TodoRepository (interface/abstraction)
```

## 📊 Data Flow Diagram

```
┌──────────────┐
│    USER      │
│  (clicks)    │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│   TodoAppController                 │
│   • Receives event                  │
│   • Validates input                 │
│   • Calls service                   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   TodoService                       │
│   • Applies business rules          │
│   • Calls repository                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   TodoApiRepository                 │
│   • Prepares API request            │
│   • Calls HTTP client               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   HttpClient                        │
│   • Makes HTTP request              │
│   • Returns response                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   JSON Server API                   │
│   • Processes request               │
│   • Returns data (TodoDTO)          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   TodoMapper                        │
│   • Converts TodoDTO → Todo         │
│   • Transforms dates                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   TodoAppController                 │
│   • Receives Todo (domain model)    │
│   • Updates state                   │
│   • Calls components                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   TodoListComponent                 │
│   • Creates TodoCards               │
│   • Renders to DOM                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   UI Updated                        │
│   • User sees changes               │
└─────────────────────────────────────┘
```

## 🔑 Key Classes & Their Roles

| Class                 | Responsibility                 | Dependencies         |
| --------------------- | ------------------------------ | -------------------- |
| `TodoAppController`   | Orchestrate app, handle events | Services, Components |
| `TodoService`         | Business logic (CRUD)          | Repository, Mapper   |
| `TodoFilterService`   | Filter & categorize            | None                 |
| `TodoApiRepository`   | API communication              | HttpClient           |
| `HttpClient`          | HTTP requests                  | Axios                |
| `TodoMapper`          | Data transformation            | None                 |
| `TodoCardComponent`   | Render single card             | None                 |
| `TodoListComponent`   | Render list                    | TodoCardComponent    |
| `EditModalComponent`  | Manage modal                   | None                 |
| `PaginationComponent` | Pagination logic               | None                 |

## 📝 Code Examples

### Before (Mixed Concerns)

```typescript
// TodoService did EVERYTHING
static async getAll() {
  const response = await axios.get('/todos'); // HTTP
  return response.data.map(d => ({           // Mapping
    ...d,
    createdAt: new Date(d.createdAt)        // Transformation
  }));
}
```

### After (Separated Concerns)

```typescript
// Repository: HTTP only
async findAll(): Promise<TodoDTO[]> {
  return httpClient.get<TodoDTO[]>('/todos');
}

// Mapper: Transformation only
static toDomain(dto: TodoDTO): Todo {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt)
  };
}

// Service: Business logic only
async getAll(): Promise<Todo[]> {
  const dtos = await this.repository.findAll();
  return TodoMapper.toDomainList(dtos);
}
```

## 🎓 Benefits Summary

| Before                   | After                                 |
| ------------------------ | ------------------------------------- |
| 1 large file (240 lines) | 11 focused files (~50-150 lines each) |
| Mixed concerns           | Separated concerns                    |
| Hard to test             | Easy to test (DI)                     |
| Hard to maintain         | Easy to maintain                      |
| Tight coupling           | Loose coupling                        |
| Low reusability          | High reusability                      |

## 🚀 Quick Start

```bash
# Terminal 1 - Start API
npm run server

# Terminal 2 - Start App
npm run dev
```

## 📚 Read More

- **ARCHITECTURE.md** - Detailed architecture explanation
- **REFACTORING_SUMMARY.md** - Complete refactoring changes
- **README.md** - Project setup guide

---

**Key Takeaway**: Each file now has ONE clear purpose, making the codebase easier to understand, test, and maintain! 🎯
