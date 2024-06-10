# 💳 Card Management App 

A React Native application for managing credit/debit cards. The app allows users to add new cards, view a list of existing cards, and perform payments with selected cards. The app integrates with the Omise payment gateway.

## Features
-	Add new credit/debit cards
-	View list of added cards
-	Make payments using selected cards
-	Real-time loading indicator during payment processing

## Technologies Used
-	React Native
-	Expo
-	TypeScript
-	Omise Payment Gateway
-	Context API for state management
-	Custom hooks for form management, loading state, and API fetching

## Prerequisites
-  Node.js (>= 12.x)
-	Expo CLI (npm install -g expo-cli)
-	Omise account with API keys

## Get Started
1.	Clone the repository:

      ```bash
      git clone https://github.com/arjunsumarlan/wegowhere.git
      cd wegowhere/payment-app/
      ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Put your **Omise API keys** on the file `config/omise/index.ts`:

   ```typescript
   export const OMISE_CONFIG = {
      PUBLIC_KEY: "pkey_test_********",
      SECRET_KEY: "skey_test_********",
   };
   ```

4. Start the app

   ```bash
    npx expo start
   ```

   In the output, you'll find options to open the app in a

   - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

   You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## File Structure

```
.
├── app
│   ├── addcard
│   │   └── _layout.tsx
│   ├── home
│   │   └── _layout.tsx
│   └── _layout.tsx
├── assets
│   ├── fonts
│   │   ├── FC Subject Rounded Bold.ttf
│   │   └── FC Subject Rounded Regular.ttf
│   └── images
├── components
│   └── CardItem.tsx
├── config
│   └── omise
│        └── index.ts
├── hooks
│   ├── index.ts
│   ├── useForm.ts
│   └── useLoading.ts
├── context
│   ├── index.ts
│   └── CardContext.tsx
├── types
│   └── omise-react-native.d.ts
├── babel.config.js
├── package.json
└── tsconfig.json
```

## Custom Hooks

### useForm

A hook to manage form state and handle form submission.

```typescript
import { useState } from 'react';

export const useForm = <T extends {}>(initialState: T) => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = (name: keyof T, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  return { formState, handleChange, resetForm };
};
```

### useLoading

A hook to manage loading state during async operations.

```typescript
import { useState } from 'react';

export const useLoading = () => {
  const [loading, setLoading] = useState(false);

  const withLoading = async (callback: () => Promise<void>) => {
    try {
      setLoading(true);
      await callback();
    } finally {
      setLoading(false);
    }
  };

  return { loading, withLoading };
};
```


## Acknowledgments

- Special thanks to the Omise team for their comprehensive payment gateway API.
- Thanks to the React Native community for their continuous support and contributions.

---
