# Vue Lottery App
A modern web application built with Vue 3 and TypeScript for managing lottery participants, validating entries, and drawing winners.

## Features
* **Participant Registration:** Add new participants using a dedicated registration form (`RegisterForm.vue`) with built-in input validation (`useValidation.ts`).
* **Participant Management:** View and manage registered users in a structured data table (`ParticipantTable.vue`).
* **Search Functionality:** Quickly find specific participants using the search bar (`SearchBar.vue`).
* **Winner Selection:** Highlight and display lottery winners using dedicated UI components (`WinnerBlock.vue`, `WinnerBadge.vue`).
* **Reusable UI Components:** Utilizes modular base components for consistent styling across the app (`BaseButton.vue`, `BaseInput.vue`, `BaseModal.vue`).



## Tech Stack
This project leverages the following frontend technologies:
* **Framework:** Vue 3
* **Language:** TypeScript (`tsconfig.json`)
* **Build Tool:** Vite (`vite.config.ts`)
* **Styling:** SCSS (`style.scss`)
* **Linting & Formatting:** ESLint (`.eslintrc.cjs`)



## Project Structure

The application follows a modular, component-based architecture:
* `src/components/` - Contains all reusable UI and feature-specific components (Buttons, Modals, Tables, Forms).
* `src/composables/` - Houses reusable Vue Composition API logic.
* `src/types/` - Contains TypeScript interfaces and data models (e.g., `participant.ts`).
* `src/App.vue` - The root application component.
* `src/main.ts` - The main application entry point.



## Setup and Installation

Follow these steps to run the project locally.

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository and navigate to the project directory:
```bash
cd vue-lottery-app

```

2. Install the project dependencies utilizing `package-lock.json`:

```bash
npm install

```



### Development Server
To start the local Vite development server, run:

```bash
npm run dev

```

### Production Build

To compile and minify the application for production environments, run:

```bash
npm run build

```
