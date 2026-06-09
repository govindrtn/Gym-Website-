# React Coding Standards

These standards apply to the Silver Gym React + Vite project.

## File Naming Convention

- Components: `PascalCase`, for example `UserCard.jsx`
- Hooks: `useCamelCase`, for example `useFetchData.js`
- Utilities: `camelCase`, for example `formatDate.js`
- Constants: `UPPER_CASE` style exports inside clear files, for example `API_CONSTANTS.js`
- Component styles: same component name with `.css`, for example `UserCard.css`

## Folder Structure

```txt
src/
  assets/
  components/
  pages/
  hooks/
  utils/
  services/
  constants/
    colors.js
    fonts.js
    index.js
  styles/
  App.jsx
```

Current project-specific folders such as `src/data` and `src/lib` can stay when they already serve a clear purpose.

## File Structure

Use this order inside component files:

```jsx
// dependencies imports
import React from "react";

// assets and css imports
import "./UserCard.css";

// project imports
import { Button } from "@/components/ui/button";

// helper imports
import { formatDate } from "@/utils/formatDate";

const UserCard = () => {
  // const declarations

  // let declarations

  // lifecycle

  // API calls

  // helper methods

  // handlers

  return <div />;
};

export default UserCard;
```

## Constants

Keep shared constants in `src/constants`.

```js
// colors.js
export const COLORS = {
  PRIMARY: "#1976d2",
  SECONDARY: "#9c27b0",
};
```

```js
// fonts.js
export const FONTS = {
  PRIMARY: "Inter, sans-serif",
};
```

## Services Pattern

Keep API calls and external data access in `src/services`.

```js
// services/userService.js
export const getUsers = async () => {
  // API call
};
```

Components should call service functions through handlers, hooks, or page-level logic instead of embedding fetch logic directly inside UI markup.

## Index Export Pattern

Use index files when a folder exports multiple reusable modules.

```js
// components/index.js
export { default as UserCard } from "./UserCard";
```

For existing named exports, this is also acceptable:

```js
export { BrandMark } from "./site/BrandMark";
```

## Basic Rules

- Keep components small.
- Avoid duplicate code.
- Do not mix UI and business logic.
- Use meaningful names.
- Keep state as close as possible to where it is used.
- Move reusable calculations into `utils`, API access into `services`, and shared values into `constants`.
- Prefer existing UI primitives from `src/components/ui` before creating new UI patterns.
