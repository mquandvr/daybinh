<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Guidelines
- Always check for clean code to ensure readability and maintainability.
- Always update markdown files (`README.md`, `BUSINESS_LOGIC.md`) when there are changes in logic or structure.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## GitHub Pages Deployment

To deploy to GitHub Pages:
1. Run `npm run build`.
2. Deploy the contents of the `dist` folder.
*Note: Fuel and vehicle data fetching may require a CORS proxy if deployed to a static environment like GitHub Pages.*
