# PopX Onboarding App

A responsive, high-fidelity user onboarding and settings application built using React, Vite, and custom CSS styling.

---

## 🚀 Features

*   **Premium & Clean Theme**: Styled using the Google Poppins font and custom CSS properties with a primary purple/violet styling accent.
*   **Multi-View Flow**: Integrates four primary views:
    *   **Landing Page**: Welcome message with pathways to create an account or sign in.
    *   **Sign In Page**: Validates user email and password against local credentials.
    *   **Registration Page**: Interactive user sign-up form with input fields for Name, Phone, Email, Password, Company Name, and Agency choice. Includes error notifications (format checking and duplications).
    *   **Profile Page**: Interactive user card showing account details, bio text, base64 avatar uploader, and logout controls.
*   **Custom Floating Outlined Inputs**: Smooth micro-animations for outlines and floating input labels that overlap borders on active states.
*   **Persisted Session State**: Retains account credentials and active logins across page reloads.

---

## 💾 Storage Details

All application data and user sessions are stored directly in the browser's **Local Storage** (`localStorage`):

1.  **Registered Users Database** (`popx_users`):
    *   Stored as a JSON-serialized array of user objects.
    *   Updated whenever a new account is registered.
2.  **Current User Session** (`popx_session`):
    *   Stored as a JSON object containing the credentials of the currently logged-in user.
    *   Removed from the database when the user logs out.

---

## 🛠️ Getting Started

To run the application locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
