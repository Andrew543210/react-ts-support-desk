
# SupportDesk

A modern, responsive ticket management application built with **React, TypeScript, and Vite**.

SupportDesk is a frontend portfolio project that demonstrates practical React architecture, type-safe state management, client-side persistence, routing, accessibility, and automated testing.

[![CI](https://github.com/Andrew543210/react-ts-support-desk/actions/workflows/ci.yml/badge.svg)](https://github.com/Andrew543210/react-ts-support-desk/actions/workflows/ci.yml)

**Repository:** https://github.com/Andrew543210/react-ts-support-desk

## Overview

SupportDesk provides a simple interface for managing support tickets.

Users can create tickets, update their details, change statuses, delete tickets, add comments, search and filter records, and monitor support activity through a dashboard.

The application is designed as a standalone frontend demo. It uses browser localStorage instead of a backend API or database.

## Features

### Ticket management

- Create support tickets with a title, description, priority, and category.
- View individual tickets and their details.
- Edit existing tickets.
- Change ticket status.
- Delete tickets with a confirmation dialog.
- Add timestamped comments to tickets.
- Display creation and last-update timestamps.

### Dashboard

- View the number of open tickets.
- Track tickets currently in progress.
- View resolved ticket counts.
- See the five most recent tickets.
- Navigate directly to ticket details.

### Search, filtering, and sorting

- Search tickets by title or description.
- Filter by status, priority, and category.
- Combine multiple filters.
- Sort by creation date or priority.
- Reset all filters to their default values.

### User experience

- Responsive layout for desktop and mobile devices.
- CSS Modules and a consistent mint-themed design system.
- Confirmation dialogs for destructive actions.
- Toast notifications for successful and unsuccessful operations.
- Form validation and preservation of entered data after failed saves.
- Custom 404 page for unknown routes.
- Application-level error boundary with a retry interface.

### Accessibility

- Semantic HTML elements.
- Accessible form labels and validation feedback.
- Keyboard navigation and visible focus indicators.
- Skip-to-content navigation.
- Accessible names for ticket status controls.
- Improved text and button contrast.
- Live announcements for notifications.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| React 19 | User interface and component architecture |
| TypeScript 6 | Static typing and type-safe data models |
| Vite 8 | Development server and production builds |
| React Router 7 | Client-side routing |
| CSS Modules | Component-scoped styling |
| React Error Boundary | Rendering error handling and recovery |
| Vitest 5 | Automated unit and component tests |
| React Testing Library | Testing UI behavior |
| Testing Library User Event | Simulating user interactions |
| ESLint | Static code analysis |
| GitHub Actions | Continuous integration |

## Getting Started

### Prerequisites

- Node.js 22.12+ or Node.js 24
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/Andrew543210/react-ts-support-desk.git
```

Navigate into the project:

```bash
cd react-ts-support-desk
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

http://localhost:5173

No API keys, environment variables, or backend services are required.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Start Vitest in watch mode |
| `npm run test:run` | Run the test suite once |
| `npm run test:run -- --coverage` | Run tests and generate a coverage report |

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Dashboard |
| `/tickets` | Ticket list, search, filters, and sorting |
| `/tickets/new` | Create a support ticket |
| `/tickets/:id` | View ticket details and comments |
| `/tickets/:id/edit` | Edit an existing ticket |
| `*` | Custom 404 Not Found page |

An existing route with an unknown ticket ID displays a ticket-specific not-found message.

## Project Structure

```text
react-ts-support-desk/
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── ConfirmDialog/
│   │   ├── Dashboard/
│   │   ├── ErrorBoundary/
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── StatCard/
│   │   ├── TicketBadge/
│   │   ├── TicketCard/
│   │   ├── TicketComments/
│   │   ├── TicketFilters/
│   │   ├── TicketForm/
│   │   ├── TicketList/
│   │   └── ToastProvider/
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   │   ├── useTicketFilters.ts
│   │   ├── useTickets.ts
│   │   └── useToast.ts
│   ├── pages/
│   │   ├── CreateTicketPage/
│   │   ├── EditTicketPage/
│   │   ├── NotFoundPage/
│   │   ├── TicketDetailsPage/
│   │   └── TicketsPage/
│   ├── styles/
│   ├── test/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Architecture

The project uses a component-based architecture with a clear separation of responsibilities.

**Components** contain reusable UI elements, including forms, cards, dialogs, and notifications.

**Pages** represent application routes and coordinate page-specific behavior.

**Custom hooks** encapsulate ticket management, filtering, sorting, and access to toast notifications.

**Types** define the ticket data model and supported statuses, priorities, and categories.

**Contexts** provide shared notification functionality.

**CSS Modules** keep component styles scoped, while shared CSS variables provide consistent colors, spacing-related tokens, and border radii.

The project intentionally avoids introducing global state management libraries that are unnecessary for its current scope.

## Data Model

Each ticket contains:

- A unique numeric ID.
- Title and description.
- Status: `open`, `in-progress`, or `resolved`.
- Priority: `low`, `medium`, or `high`.
- Category: `technical`, `billing`, `account`, or `general`.
- Creation and last-update timestamps.
- An array of comments.

Each comment includes a unique ID, author, content, and creation timestamp.

## Data Persistence

SupportDesk uses browser localStorage to persist ticket changes.

The application stores data using these keys:

```text
supportdesk:tickets
supportdesk:nextTicketId
```

On initialization, the application attempts to load previously stored tickets. When no saved data exists, it uses the bundled demo tickets.

Stored ticket data is validated and normalized before being used by the application. Invalid records are filtered out, duplicate ticket IDs are removed, and legacy records are normalized where supported.

Ticket IDs are tracked separately to avoid reusing an ID after a ticket is deleted.

### Persistence error handling

Ticket changes are written to localStorage before the React state is updated.

If persistence fails, the operation reports a failure instead of displaying a misleading success message.

Ticket creation, editing, and commenting interfaces preserve user input after unsuccessful saves.

### Resetting demo data

To reset the application, open the browser Developer Tools console and execute:

```javascript
localStorage.removeItem("supportdesk:tickets")
localStorage.removeItem("supportdesk:nextTicketId")
location.reload()
```

**Warning:** This permanently removes locally saved ticket changes for the current website origin.

### Storage limitations

localStorage is browser-specific and origin-specific.

This means:

- Data is not shared between users or devices.
- Data is not synchronized between browsers.
- Clearing site storage deletes saved changes.
- There is no central database or server-side backup.
- Concurrent modifications across browser tabs are not transactionally coordinated.

This persistence approach is intentional for a standalone frontend demonstration.

## Testing

The project uses Vitest together with React Testing Library.

Automated tests cover:

- Ticket initialization and stored-data validation.
- Ticket creation, editing, deletion, and status changes.
- Comment creation and validation.
- Persistence failures and recovery scenarios.
- Ticket filtering and sorting.
- Form validation.
- Confirmation dialogs and toast notifications.
- Dashboard and ticket components.
- Routing and not-found behavior.
- Error boundary rendering and recovery.
- Selected keyboard accessibility behaviors.

Run all tests:

```bash
npm run test:run
```

Generate a coverage report:

```bash
npm run test:run -- --coverage
```

Coverage results are printed in the terminal and generated in the `coverage/` directory.

Open `coverage/index.html` to inspect the HTML coverage report.

## Continuous Integration

GitHub Actions runs automated quality checks when changes are pushed to `main`, when a pull request targets `main`, or when the workflow is started manually.

The CI workflow:

1. Checks out the repository.
2. Sets up Node.js 22 and 24.
3. Installs dependencies using `npm ci`.
4. Runs ESLint.
5. Builds the production application.
6. Runs automated tests with coverage.
7. Uploads a coverage report artifact from the Node.js 24 job.

The configuration is located at:

`.github/workflows/ci.yml`

Check the latest workflow status in the repository's Actions tab.

## Error Handling

The application uses `react-error-boundary` to handle unexpected errors during React component rendering.

A custom fallback interface displays an error message and a retry button.

Application operations also handle localStorage persistence failures and display appropriate notifications.

A custom 404 page handles unknown application routes.

## Deployment

The project can be deployed to a static hosting service supporting Vite applications, such as Vercel or Netlify.

Production build:

```bash
npm run build
```

Build output:

```text
dist/
```

Because SupportDesk uses React Router with browser history, the hosting platform must be configured to serve `index.html` for client-side application routes.

A deployment URL and screenshots will be added after the production deployment is complete.

## Known Limitations

SupportDesk is a frontend demonstration, not a production multi-user helpdesk service.

The current project does not include:

- A backend API or database.
- Real user authentication or authorization.
- Multi-user synchronization.
- Server-side ticket assignment.
- Real email or push notifications.
- Transactional persistence across browser tabs.

The displayed support agent is part of the demonstration interface.

## Project Goals

This project demonstrates:

- Building maintainable React applications with TypeScript.
- Designing reusable components and custom hooks.
- Managing local state and browser persistence.
- Handling routing, forms, and error scenarios.
- Writing automated UI and business-logic tests.
- Applying accessibility improvements.
- Configuring continuous integration.
- Preparing a frontend project for deployment.

## Author

Developed by [Andrew543210](https://github.com/Andrew543210).

Source code: [react-ts-support-desk](https://github.com/Andrew543210/react-ts-support-desk)
