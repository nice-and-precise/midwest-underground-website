<!-- TOC -->

## Table of Contents

- [📁 File Naming](#file-naming)
  - [Components](#components)
  - [Utilities & Helpers](#utilities-helpers)
  - [Test Files](#test-files)
  - [Documentation](#documentation)
  - [Style Files](#style-files)
  - [Configuration Files](#configuration-files)
- [💻 Code Naming](#code-naming)
  - [Functions](#functions)
  - [Variables](#variables)
  - [Constants](#constants)
  - [Types & Interfaces](#types-interfaces)
  - [Enums](#enums)
  - [React Components](#react-components)
  - [React Hooks](#react-hooks)
  - [Props Interfaces](#props-interfaces)
- [🗄 Database Naming](#database-naming)
  - [Table/Collection Names](#tablecollection-names)
  - [Column/Field Names](#columnfield-names)
  - [Primary Keys](#primary-keys)
  - [Junction Tables](#junction-tables)
  - [Indexes](#indexes)
- [🌐 API Naming](#api-naming)
  - [Endpoint Paths](#endpoint-paths)
  - [Resource Actions](#resource-actions)
  - [Query Parameters](#query-parameters)
  - [Request/Response Bodies](#requestresponse-bodies)
- [🔀 Git Conventions](#git-conventions)
  - [Branch Names](#branch-names)
  - [Commit Messages](#commit-messages)
  - [Tag Names](#tag-names)
- [📊 Quick Reference Tables](#quick-reference-tables)
  - [File Naming Summary](#file-naming-summary)
  - [Code Naming Summary](#code-naming-summary)
  - [Database Naming Summary](#database-naming-summary)
  - [API Naming Summary](#api-naming-summary)
- [⚠️ Anti-Patterns to Avoid](#anti-patterns-to-avoid)
  - [Don't Mix Naming Styles](#dont-mix-naming-styles)
  - [Don't Use Abbreviations Unless Universal](#dont-use-abbreviations-unless-universal)
  - [Don't Use Single-Letter Variables (Except Loops)](#dont-use-single-letter-variables-except-loops)
  - [Don't Use Prefixes Like I or T](#dont-use-prefixes-like-i-or-t)
  - [Don't Use Generic Names](#dont-use-generic-names)
- [🎯 Enforcement](#enforcement)
- [📝 Contributing](#contributing)

<!-- /TOC -->

# Naming Conventions - Midwest Underground of Minnesota Inc

<!-- Last Updated: 2025-11-23 -->
<!-- Version: 2.0.0 -->

Comprehensive naming standards for files, code, databases, APIs, and version control.

---

## 📁 File Naming

### Components

**Pattern:** `PascalCase.tsx` or `PascalCase.jsx`

```
✅ UserProfile.tsx
✅ NavigationBar.tsx
✅ ProjectCard.tsx

❌ userProfile.tsx
❌ navigation-bar.tsx
❌ project_card.tsx
```

### Utilities & Helpers

**Pattern:** `kebab-case.ts` or `kebab-case.js`

```
✅ format-date.ts
✅ api-client.ts
✅ string-utils.ts

❌ formatDate.ts
❌ APIClient.ts
❌ string_utils.ts
```

### Test Files

**Pattern:** Match source file with `.test` or `.spec` suffix

```
✅ UserProfile.test.tsx
✅ format-date.test.ts
✅ api-client.spec.ts

❌ UserProfileTest.tsx
❌ test-format-date.ts
```

### Documentation

**Pattern:** `SCREAMING-KEBAB-CASE.md` for primary docs, `kebab-case.md` for guides

```
✅ README.md
✅ BRAND-STANDARDS.md
✅ NAMING-CONVENTIONS.md
✅ installation-guide.md
✅ api-reference.md

❌ brandStandards.md
❌ Naming_Conventions.md
```

### Style Files

**Pattern:** `kebab-case.css` or `kebab-case.scss`

```
✅ global-styles.css
✅ theme-variables.scss
✅ button-variants.css

❌ GlobalStyles.css
❌ theme_variables.scss
```

### Configuration Files

**Pattern:** Standard config file names or `kebab-case`

```
✅ .env
✅ .eslintrc.json
✅ tsconfig.json
✅ next.config.js
✅ tailwind.config.js

❌ ESLintConfig.json
❌ ts_config.json
```

---

## 💻 Code Naming

### Functions

**Pattern:** `camelCase`, verb-based

```typescript
✅ function getUserProfile() {}
✅ function calculateTotal() {}
✅ function handleSubmit() {}
✅ async function fetchProjectData() {}

❌ function GetUserProfile() {}
❌ function user_profile() {}
❌ function profile() {} // Not verb-based
```

### Variables

**Pattern:** `camelCase`, descriptive nouns

```typescript
✅ const userName = "John";
✅ let projectCount = 0;
✅ const isAuthenticated = true;
✅ const userProjects = [];

❌ const UserName = "John";
❌ let project_count = 0;
❌ const auth = true; // Too abbreviated
```

### Constants

**Pattern:** `SCREAMING_SNAKE_CASE` for true constants, `camelCase` for config objects

```typescript
✅ const MAX_RETRY_ATTEMPTS = 3;
✅ const API_BASE_URL = "https://api.example.com";
✅ const DEFAULT_TIMEOUT = 5000;

✅ const config = { apiKey: "...", timeout: 5000 };

❌ const maxRetryAttempts = 3; // Should be SCREAMING_SNAKE_CASE
❌ const api_base_url = "...";
```

### Types & Interfaces

**Pattern:** `PascalCase`

```typescript
✅ type UserRole = "admin" | "member" | "guest";
✅ interface ProjectData {
  id: string;
  title: string;
}
✅ type ApiResponse<T> = {
  data: T;
  error?: string;
};

❌ type userRole = "admin" | "member";
❌ interface projectData {}
```

### Enums

**Pattern:** `PascalCase` for enum name, `PascalCase` for values

```typescript
✅ enum ProjectStatus {
  Draft = "draft",
  Published = "published",
  Archived = "archived"
}

❌ enum projectStatus {}
❌ enum ProjectStatus {
  DRAFT = "draft", // Use PascalCase, not SCREAMING
  published = "published"
}
```

### React Components

**Pattern:** `PascalCase`, noun-based

```typescript
✅ function UserProfile() {}
✅ const NavigationBar = () => {};
✅ export default function ProjectCard() {}

❌ function userProfile() {}
❌ const navigationBar = () => {};
❌ function getUser() {} // Verb-based, not a component
```

### React Hooks

**Pattern:** `camelCase`, must start with `use`

```typescript
✅ function useAuth() {}
✅ function useLocalStorage() {}
✅ function useDebounce() {}

❌ function UseAuth() {}
❌ function authHook() {} // Must start with 'use'
❌ function getAuth() {} // Must start with 'use'
```

### Props Interfaces

**Pattern:** `ComponentNameProps`

```typescript
✅ interface UserProfileProps {
  userId: string;
  showAvatar?: boolean;
}

✅ type NavigationBarProps = {
  items: NavItem[];
};

❌ interface IUserProfileProps {} // No 'I' prefix
❌ interface UserProfile_Props {} // No underscores
❌ interface Props {} // Too generic
```

---

## 🗄 Database Naming

### Table/Collection Names

**Pattern:** `snake_case`, plural

```
✅ users
✅ project_members
✅ equipment_categories

❌ Users
❌ ProjectMembers
❌ user (should be plural)
```

### Column/Field Names

**Pattern:** `snake_case`

```
✅ user_id
✅ created_at
✅ email_address
✅ is_active

❌ userId
❌ createdAt
❌ EmailAddress
```

### Primary Keys

**Pattern:** `id` or `table_name_id`

```
✅ id
✅ user_id (for foreign keys)
✅ project_id

❌ ID
❌ userId
❌ user_pk
```

### Junction Tables

**Pattern:** `table1_table2` (alphabetical order)

```
✅ project_users
✅ category_equipment
✅ tag_projects

❌ users_projects
❌ ProjectUsers
```

### Indexes

**Pattern:** `idx_table_column(s)`

```
✅ idx_users_email
✅ idx_projects_status_created_at
✅ idx_members_user_id

❌ index_users_email
❌ users_email_idx
```

---

## 🌐 API Naming

### Endpoint Paths

**Pattern:** `kebab-case`, plural nouns for collections

```
✅ /api/users
✅ /api/projects
✅ /api/user-profiles
✅ /api/equipment-categories

❌ /api/Users
❌ /api/getUsers
❌ /api/user_profiles
```

### Resource Actions

**Pattern:** Use HTTP verbs, not action names in path

```
✅ GET /api/users
✅ POST /api/users
✅ PUT /api/users/:id
✅ DELETE /api/users/:id
✅ GET /api/users/:id/projects

❌ GET /api/getUsers
❌ POST /api/createUser
❌ GET /api/users/delete/:id
```

### Query Parameters

**Pattern:** `camelCase`

```
✅ ?sortBy=createdAt
✅ ?pageSize=20
✅ ?includeInactive=true

❌ ?sort_by=createdAt
❌ ?page-size=20
❌ ?IncludeInactive=true
```

### Request/Response Bodies

**Pattern:** `camelCase` for JSON keys

```json
✅ {
  "userId": "123",
  "firstName": "John",
  "projectIds": [1, 2, 3]
}

❌ {
  "user_id": "123",
  "FirstName": "John"
}
```

---

## 🔀 Git Conventions

### Branch Names

**Pattern:** `type/short-description`

Types: `feature`, `bugfix`, `hotfix`, `refactor`, `docs`, `chore`

```
✅ feature/user-authentication
✅ bugfix/navbar-scroll-issue
✅ hotfix/critical-security-patch
✅ refactor/api-client-structure
✅ docs/update-installation-guide
✅ chore/update-dependencies

❌ Feature/UserAuthentication
❌ user_authentication
❌ fix-stuff
```

### Commit Messages

**Pattern:** `type(scope): description`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

```
✅ feat(auth): add OAuth2 integration
✅ fix(ui): resolve navbar z-index issue
✅ docs(api): update endpoint documentation
✅ refactor(utils): simplify date formatting logic
✅ test(auth): add login flow tests
✅ chore(deps): update React to v18.3

❌ Added new feature
❌ Fixed bug
❌ Updates
```

### Tag Names

**Pattern:** Semantic versioning `v{major}.{minor}.{patch}`

```
✅ v1.0.0
✅ v1.2.3
✅ v2.0.0-beta.1

❌ version-1.0.0
❌ 1.0.0
❌ release-1
```

---

## 📊 Quick Reference Tables

### File Naming Summary

| Category        | Pattern                  | Example                      |
|-----------------|--------------------------|------------------------------|
| Components      | PascalCase               | `UserProfile.tsx`            |
| Utils/Helpers   | kebab-case               | `format-date.ts`             |
| Tests           | Match source + .test     | `UserProfile.test.tsx`       |
| Primary Docs    | SCREAMING-KEBAB-CASE.md  | `BRAND-STANDARDS.md`         |
| Guide Docs      | kebab-case.md            | `installation-guide.md`      |
| Styles          | kebab-case               | `global-styles.css`          |

### Code Naming Summary

| Category        | Pattern                  | Example                      |
|-----------------|--------------------------|------------------------------|
| Functions       | camelCase (verb)         | `getUserProfile()`           |
| Variables       | camelCase (noun)         | `userName`                   |
| Constants       | SCREAMING_SNAKE_CASE     | `MAX_RETRY_ATTEMPTS`         |
| Types/Interfaces| PascalCase               | `UserProfile`                |
| Enums           | PascalCase               | `ProjectStatus.Draft`        |
| Components      | PascalCase (noun)        | `NavigationBar`              |
| Hooks           | camelCase (use prefix)   | `useAuth()`                  |
| Props           | ComponentNameProps       | `UserProfileProps`           |

### Database Naming Summary

| Category        | Pattern                  | Example                      |
|-----------------|--------------------------|------------------------------|
| Tables          | snake_case (plural)      | `project_members`            |
| Columns         | snake_case               | `created_at`                 |
| Primary Keys    | id                       | `id`, `user_id` (FK)         |
| Junction Tables | table1_table2            | `project_users`              |
| Indexes         | idx_table_column         | `idx_users_email`            |

### API Naming Summary

| Category        | Pattern                  | Example                      |
|-----------------|--------------------------|------------------------------|
| Endpoints       | kebab-case (plural)      | `/api/user-profiles`         |
| Query Params    | camelCase                | `?sortBy=name`               |
| JSON Keys       | camelCase                | `"userId": "123"`            |

---

## ⚠️ Anti-Patterns to Avoid

### Don't Mix Naming Styles

```typescript
❌ const user_name = getUserName(); // Mixed snake_case and camelCase
✅ const userName = getUserName();
```

### Don't Use Abbreviations Unless Universal

```typescript
❌ const usr = getUsr();
❌ const msg = "Hello";
✅ const user = getUser();
✅ const message = "Hello";

// OK for universal abbreviations:
✅ const id = "123";
✅ const api = new APIClient();
✅ const url = "https://...";
```

### Don't Use Single-Letter Variables (Except Loops)

```typescript
❌ const u = getUser();
❌ const p = projects.map(p => p.name);

✅ const user = getUser();
✅ const names = projects.map(project => project.name);

// OK in loops:
✅ for (let i = 0; i < array.length; i++) {}
```

### Don't Use Prefixes Like `I` or `T`

```typescript
❌ interface IUser {}
❌ type TProject = {};

✅ interface User {}
✅ type Project = {};
```

### Don't Use Generic Names

```typescript
❌ function handle() {}
❌ const data = getData();
❌ interface Props {}

✅ function handleSubmit() {}
✅ const userData = getUserData();
✅ interface UserProfileProps {}
```

---

## 🎯 Enforcement

These conventions are enforced through:

* **ESLint:** Naming convention rules
* **Prettier:** File formatting
* **Husky:** Pre-commit hooks
* **Code Review:** Manual verification
* **Documentation:** This file and team training

---

## 📝 Contributing

When you identify a naming pattern not covered here or find an inconsistency:

1. Document the issue in a GitHub issue
2. Propose a solution following existing patterns
3. Update this document via pull request
4. Update code examples and tooling configs

---

**Maintained by:** @nice-and-precise
**Last Updated:** 2025-11-23
**Version:** 2.0.0
