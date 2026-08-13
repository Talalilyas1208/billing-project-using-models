# Billing Project Using Models

A React JS boilerplate for a billing application.

## Tech Stack

- **React JS** (via Vite)
- **Ant Design** — UI component library
- **Redux Toolkit** — state management
- **Tailwind CSS** — utility-first CSS framework
- **useLocalStorage** — custom hook for persistent local state

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── hooks/
│   └── useLocalStorage.js    # Custom localStorage hook
├── store/
│   ├── index.js              # Redux store configuration
│   └── slices/
│       └── billingSlice.js   # Billing state slice
├── App.jsx                   # Main app component
├── App.css                   # App-specific styles
├── index.css                 # Tailwind CSS directives
└── main.jsx                  # Entry point with Redux Provider
```
