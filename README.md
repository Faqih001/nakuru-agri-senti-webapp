# Nakuru AgriSenti WebApp

## Project Overview

AgriSenti is a comprehensive agricultural assistance web application designed specifically for farmers in Nakuru, Kenya. The platform integrates multiple tools to help farmers optimize their agricultural practices, monitor crop health, track market prices, and receive personalized farming recommendations.

## Features

- **Crop Assistant**: An AI-powered chat assistant that provides farming advice, crop management guidance, planting schedules, and fertilizer recommendations tailored to Nakuru's agricultural conditions.

- **Disease Detection**: Allows farmers to upload images of their crops for AI analysis to identify diseases, pests, and nutritional deficiencies, with detailed recommendations for treatment and prevention.

- **Market Dashboard**: Displays real-time data on crop prices, price trends, and connects farmers with potential buyers, helping them make informed decisions about when and where to sell their produce.

- **Weather Monitoring**: Provides localized weather forecasts and alerts relevant to agricultural activities in different regions of Nakuru.

- **Interactive Maps**: Visualizes agricultural data, market locations, and farm distribution across the Nakuru region.

## Technologies Used

### Frontend
- **React**: JavaScript library for building the user interface
- **TypeScript**: Adds static typing to JavaScript
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI and Tailwind
- **React Router Dom**: Navigation between pages
- **Recharts**: Charting library for data visualization

### Backend Integration
- **Supabase**: Backend-as-a-Service for authentication, database, and storage
- **Supabase Functions**: Serverless functions for backend logic

### Maps and Visualization
- **Mapbox**: Interactive mapping and geospatial features

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm or Bun package manager

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_REPO_URL>

# Step 2: Navigate to the project directory
cd nakuru-agri-senti-webapp

# Step 3: Install dependencies
npm install
# or if using Bun
bun install

# Step 4: Start the development server
npm run dev
# or
bun run dev
```

### Building for Production

```sh
npm run build
# or
bun run build
```

## Environment Setup

Create a `.env` file in the root directory with your Supabase configuration:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
