# Nakuru AgriSenti WebApp

![AgriSenti Logo](public/agri.png)

## Project Overview

AgriSenti is a comprehensive agricultural assistance web application designed specifically for farmers in Nakuru County, Kenya. The platform leverages modern technology to address key challenges faced by local farmers, including limited access to agricultural expertise, difficulty in identifying crop diseases, and lack of market information.

Developed to bridge the information gap in Nakuru's agricultural sector, AgriSenti integrates multiple tools that help farmers optimize their agricultural practices, monitor crop health in real-time, track market prices for better decision-making, and receive personalized farming recommendations based on local conditions. The application is designed with a user-friendly interface that considers the varying technical literacy levels of farmers in the region.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Authentication System](#authentication-system)
- [Email Verification System](#email-verification-system)
- [Google Gemini AI Integration](#google-gemini-ai-integration)
- [Asset Management](#asset-management)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Team](#meet-our-team)
- [Acknowledgments](#acknowledgments)

## Features

### Crop Assistant

An AI-powered virtual agricultural expert that provides:

- **Personalized Farming Advice**: Tailored recommendations based on Nakuru's unique soil conditions, climate patterns, and local agricultural practices
- **Crop Management Guidance**: Step-by-step instructions for optimal crop care throughout the growing season
- **Planting Schedules**: Customized planting calendars accounting for Nakuru's bimodal rainfall patterns
- **Fertilizer Recommendations**: Soil-specific fertilizer advice to maximize yields while minimizing environmental impact
- **Pest Management Strategies**: Integrated pest management techniques focusing on sustainable and affordable solutions
- **Natural Language Interface**: Supports conversations in English and Swahili for maximum accessibility

### Disease Detection

A sophisticated plant health monitoring system that:

- **Analyzes Crop Images**: Uses computer vision algorithms to process uploaded photos of plant leaves, stems, and fruits
- **Identifies 20+ Common Diseases**: Accurately detects prevalent diseases affecting maize, beans, potatoes, and other Nakuru staple crops
- **Diagnoses Nutrient Deficiencies**: Recognizes visual symptoms of specific mineral deficiencies in plants
- **Provides Treatment Protocols**: Offers detailed, actionable treatment plans with both organic and conventional options
- **Suggests Preventive Measures**: Recommends practices to avoid recurrence and spread
- **Works Offline**: Core detection capabilities function without internet connection for remote farm use

### Market Dashboard

A comprehensive market intelligence platform that:

- **Tracks Real-Time Crop Prices**: Monitors current selling prices across Nakuru's major agricultural markets
- **Analyzes Price Trends**: Visualizes historical price data with interactive charts to identify optimal selling periods
- **Connects to Verified Buyers**: Provides direct links to pre-vetted agricultural buyers and processing companies
- **Displays Quality Requirements**: Shows specific quality standards required by different buyers
- **Features Market Forecasts**: Predicts price movements based on historical patterns and current market conditions
- **Enables Direct Messaging**: Allows farmers to communicate with buyers through the platform

### Weather Monitoring

A specialized agricultural weather system that:

- **Provides Hyperlocal Forecasts**: Offers micro-climate predictions specific to Nakuru's diverse topography
- **Issues Early Weather Alerts**: Warns about incoming weather events that could impact farming operations
- **Tracks Seasonal Patterns**: Analyzes rainfall distribution and temperature trends throughout the year
- **Includes Agricultural Interpretation**: Translates weather data into specific farming recommendations
- **Monitors Soil Moisture**: Integrates data from local weather stations to estimate field conditions
- **Offers Climate-Smart Guidance**: Suggests adaptive measures in response to changing climate patterns

### Interactive Maps

A geospatial information system that:

- **Visualizes Agricultural Data**: Maps out crop distribution, yield potential, and land utilization across Nakuru County
- **Locates Market Centers**: Shows the positions of trading centers with information on market days and specializations
- **Identifies Extension Services**: Pinpoints locations of agricultural extension offices and input suppliers
- **Maps Water Resources**: Displays water points, irrigation schemes, and water conservation structures
- **Shows Infrastructure Access**: Highlights road networks and transportation options for market access
- **Features Land Suitability Analysis**: Color-coded maps indicating optimal areas for different crop varieties

## Technologies Used

### Frontend

- **React (18.3+)**: A JavaScript library for building dynamic user interfaces with component-based architecture
- **TypeScript (5.5+)**: Enhances development with strong typing, better IDE support, and reduced runtime errors
- **Vite (5.4+)**: Modern build tool offering lightning-fast HMR (Hot Module Replacement) and optimized production builds
- **Tailwind CSS (3.4+)**: Utility-first CSS framework for rapidly building custom designs without leaving HTML
- **shadcn/ui**: A collection of accessible and customizable components built on Radix UI primitives
- **React Router Dom (6.26+)**: Declarative routing for React applications with support for dynamic route matching
- **Recharts (2.12+)**: Composable charting library built on React components for responsive data visualization
- **Lucide React**: A library of simply beautiful open source icons for consistent visual elements

### State Management & Data Fetching

- **React Query (TanStack Query 5.56+)**: Data fetching, caching, and state management library for asynchronous operations
- **React Hook Form (7.53+)**: Performance-focused form validation library with minimal re-renders
- **Zod (3.23+)**: TypeScript-first schema validation with static type inference for robust data validation

### Backend Integration

- **Supabase (2.49+)**: Open-source Firebase alternative providing:
  - PostgreSQL database with powerful querying capabilities
  - Built-in authentication with multiple providers
  - Storage for images and files with fine-grained access control
  - Edge functions for serverless backend operations
  - Real-time subscriptions for live data updates

### Maps and Visualization

- **Google Maps API**: Interactive, customizable maps with extensive features including:
  - High-performance map rendering
  - Custom styles and data visualization
  - Geocoding and geolocation services

### AI Integration

- **Google Gemini API**: Advanced AI models powering features such as crop assistant, disease detection, and weather insights

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended for best performance)
- **Package Manager**: npm v9+ or Bun v1.0.2+
- **Supabase Account**: Free tier sufficient for development
- **Google Maps API Key**: Required for map functionality
- **Google Gemini API Key**: Required for AI features

### Development Environment Setup

```sh
# Step 1: Clone the repository
git clone https://github.com/yourusername/nakuru-agri-senti-webapp.git

# Step 2: Navigate to the project directory
cd nakuru-agri-senti-webapp

# Step 3: Install dependencies
npm install
# or if using Bun for faster installation
bun install

# Step 4: Create environment configuration file
cp env.example .env.local

# Step 5: Fill in required environment variables in .env.local
# - Add your Supabase URL and anon key
# - Add your Google Maps API key
# - Configure other optional services

# Step 6: Start the development server
npm run dev
# or
bun run dev
```

### Building for Production

```sh
# Generate optimized production build
npm run build

# Preview the production build locally
npm run preview
```

## Deployment Options

### Vercel Deployment (Recommended)

1. Fork this repository to your GitHub account
2. Connect your Vercel account to GitHub
3. Import the repository in Vercel dashboard
4. Configure environment variables
5. Deploy with default settings

### Traditional Hosting

1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your web server
3. Configure your server to handle SPA routing (redirect 404s to index.html)

## Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# API Configuration
VITE_API_BASE_URL=https://api.weatherapi.com/v1
VITE_WEATHER_API_KEY=b3526825bf6345ad829220441252605

# Google Gemini AI API key
VITE_GEMINI_API_KEY=AIzaSyDEFsF9visXbuZfNEvtPvC8wI_deQBH-ro

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## Project Structure

```text
nakuru-agri-senti-webapp/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Base UI components from shadcn
│   │   └── ...           # Feature-specific components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # Third-party service integrations
│   ├── lib/              # Utility functions and helpers
│   ├── pages/            # Page components
│   └── main.tsx          # Application entry point
├── supabase/             # Supabase configuration and edge functions
│   ├── functions/        # Serverless functions
│   └── migrations/       # Database migration files
├── .env.example          # Example environment variables
└── package.json          # Project dependencies and scripts
```

## Authentication System

AgriSenti uses Supabase for authentication and database operations.

### Required Environment Variables

The authentication system requires the following environmental variables:

```env
VITE_SUPABASE_URL=<your_supabase_url>
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>
VITE_SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```

### Getting the Service Role Key

1. Log into the [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Project Settings > API
4. Copy your service role key (under "Project API keys")
5. Paste it in your `.env` file for the `VITE_SUPABASE_SERVICE_ROLE_KEY` variable

### Important Security Notes

- The service role key has full access to your database, bypassing Row Level Security (RLS)
- Never expose this key in frontend code that gets sent to browsers
- Only use the service role key for secure server operations or during development
- In production, consider replacing the direct service role key usage with a secure API endpoint

### Authentication Troubleshooting

#### 1. Connection Issues

**Symptoms:**

- Error messages containing "ERR_NAME_NOT_RESOLVED", "Failed to fetch", or "Connection refused"
- Authentication operations fail but the internet connection works for other sites

**Solutions:**

- Run `./debug-connection.sh` to diagnose DNS and connectivity issues
- Check if your network blocks the Supabase domain
- Try using a different DNS server (like 8.8.8.8) if your default DNS has issues
- Test the connection using `./public/supabase-test.html` in your browser

#### 2. Service Role Authentication Issues

**Symptoms:**

- Profile creation fails after signup
- Error messages related to JWT token or authorization
- Error messages mentioning "role" claim or permission denied

**Solutions:**

- Run `./debug-jwt.sh` to check for JWT token format issues
- Ensure your Supabase service role key has "role": "service_role" (not "rose": "service_role")
- Verify you're using the correct service role key from your Supabase dashboard
- Check that the environmental variable `VITE_SUPABASE_SERVICE_ROLE_KEY` is correctly set

#### 3. Complete Authentication Testing

Run the full test suite to validate all authentication components:

```sh
./test-auth.sh
```

This will check:

1. Basic connectivity to Supabase
2. JWT token format and claims
3. Authentication with anon key
4. Authentication with service role key
5. Set up URLs for in-browser testing tools

### Debugging Tools

This project includes several debugging tools:

- **./debug-connection.sh**: Diagnoses network connectivity issues with Supabase
- **./debug-jwt.sh**: Validates your JWT token format and can fix common typos
- **./test-auth.sh**: Comprehensive test suite for all authentication components
- **/public/supabase-test.html**: Browser-based connection testing
- **/public/email-confirmation-test.html**: Tool to test and fix email confirmation issues

## Email Verification System

### Overview

The email verification flow works as follows:

1. User signs up with their email and password
2. A verification email is sent to the user's email address
3. User clicks the verification link in the email
4. The system verifies the user's email and marks it as confirmed
5. User is redirected to the login page
6. User can now log in successfully

### Components

#### 1. Signup Process

The signup process in `AuthContext.tsx` initiates the email verification by:

- Sending a verification email to the user's email address
- Creating an unverified user account
- In development mode, it auto-confirms the email for testing purposes
- In production, it requires the user to click the verification link

#### 2. Email Verification Page

The `VerifyEmail.tsx` component handles:

- Extracting the token from the URL
- Calling the Supabase function to verify the email
- Displaying the verification status (loading/success/error)
- Redirecting to the login page upon successful verification

#### 3. Resend Verification Page

The `ResendVerification.tsx` component allows users to:

- Request a new verification email if they didn't receive the original
- Enter their email address
- Submit to have a new verification email sent

#### 4. Supabase Function

The `verify-email` Supabase function:

- Receives the verification token
- Validates the user
- Updates the user's profile to mark the email as verified
- Returns a response with redirection information

### Email Verification Environment Configuration

The system behaves differently based on the environment:

#### Development Environment

- Email verification can be bypassed (auto-confirmed)
- Redirects happen within the local development server
- URLs use the local origin (e.g. <http://localhost:5173>)

#### Production Environment

- Full email verification flow is enforced
- All redirects use the production URL: <https://nakuru-agri-senti-webapp.vercel.app/>
- Email verification redirects to: <https://nakuru-agri-senti-webapp.vercel.app/auth>

### Email Verification Testing

Use the provided test script to test the email verification flow:

```bash
./test-email-verification.sh
```

This script:

1. Creates a test user
2. Simulates email verification
3. Tests signing in with the verified user
4. Tests the verify-email function
5. Validates the redirect URL points to the correct production URL

### Email Verification Troubleshooting

#### User cannot log in after signup

- Check if the email verification is completed
- Use the "Resend verification email" option
- Check spam/junk folders

#### Verification link doesn't work

- Ensure the link is clicked without any modifications
- Check if the link has expired (valid for 24 hours)
- Request a new verification link if needed

#### Redirect issues

- Ensure the correct URLs are configured in both development and production
- Check for any cross-domain redirect issues

## Google Gemini AI Integration

AgriSenti integrates Google's Gemini AI models to power intelligent features across the application.

### API Key

The Gemini API key is stored in the environment variable `VITE_GEMINI_API_KEY`. The default key is provided in the code for development purposes, but for production deployments, you should use your own API key.

### Integration Components

The following components use the Gemini AI API:

1. **CropAssistant** (`/src/components/CropAssistant.tsx`) - Uses Gemini 2.0 Flash for intelligent farming advice
2. **DiseaseDetection** (`/src/components/DiseaseDetection.tsx`) - Uses Gemini 2.0 Flash for plant disease detection
3. **WeatherDashboard** (`/src/pages/WeatherDashboard.tsx`) - Uses Gemini 2.0 Flash for weather-based farming insights
4. **AIChatbot** (`/src/components/AIChatbot.tsx`) - Uses Gemini 2.5 Flash Preview for the general AI chatbot

### Basic Usage Example

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDEFsF9visXbuZfNEvtPvC8wI_deQBH-ro";
const genAI = new GoogleGenerativeAI(API_KEY);

// Create a function to use the Gemini API
const generateContent = async (prompt: string): Promise<string> => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
```

### Using with Images (Vision API)

```typescript
// For components that need to analyze images
const analyzeImage = async (imageBase64: string, prompt: string): Promise<string> => {
  // Get the model with vision capability
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  // Prepare the image part
  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: "image/jpeg",
    },
  };
  
  // Generate content with text and image
  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  return response.text();
};
```

### Gemini AI Best Practices

1. **Use React's `useMemo` hook** to prevent recreating the Gemini client on each render:

   ```typescript
   const genAI = useMemo(() => new GoogleGenerativeAI(API_KEY), [API_KEY]);
   ```

2. **Add proper error handling** to manage API failures gracefully.

3. **Craft effective prompts** that provide context relevant to farming in Nakuru, Kenya.

4. **Use the right model** for each task:
   - Text: `gemini-2.0-flash`
   - Images: `gemini-2.0-flash`
   - Advanced chatbot: `gemini-2.5-flash-preview-05-20`

### Gemini API Resources

- [Google AI Studio](https://ai.google.dev/studio) - To test prompts
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Node.js SDK Reference](https://github.com/google/generative-ai-js)

## Asset Management

The project includes various assets organized by type:

### Images

Located in `public/assets/images/`:

- **agri-banner.png** - Main banner for the AgriSenti application
- **crop-assistant.png** - Illustration for the Crop Assistant feature
- **disease-detection.png** - Illustration for the Disease Detection feature
- **market-dashboard.png** - Illustration for the Market Dashboard feature
- **weather-monitoring.png** - Illustration for the Weather Monitoring feature
- **interactive-maps.png** - Illustration for the Interactive Maps feature

### Team Member Images

Located in `public/assets/team/`:

- **team-member-1.png** - Photo of Fakii Mohammed (CEO)
- **team-member-2.png** - Andrew Ogembo (CTO) - Uses icon
- **team-member-3.png** - Chiboniso Nyoni (User Experience Lead) - Uses icon

### Icons

Located in `public/assets/icons/`:

- **agri-logo.png** - Official AgriSenti logo

### Root Assets

Located in the `public/` directory:

- **favicon.ico** - Website favicon based on the AgriSenti logo
- **agri.png** - Main AgriSenti logo image used for social media sharing

## Feature Images

All feature images are sourced from Unsplash, optimized for performance and consistency:

### AI Crop Assistant Feature

- **Source**: [Unsplash Photo by Gabriel Jimenez](https://images.unsplash.com/photo-1574943320219-553eb213f72d)
- **Dimensions**: 800x600px (cropped)

### Disease Detection Feature

- **Source**: [Unsplash Photo by Ales Krivec](https://images.unsplash.com/photo-1416879595882-3373a0480b5b)
- **Dimensions**: 800x600px (cropped)

### Market Intelligence Feature

- **Source**: [Unsplash Photo by Carlos Muza](https://images.unsplash.com/photo-1460925895917-afdab827c52f)
- **Dimensions**: 800x600px (cropped)

### Risk Management Feature

- **Source**: [Unsplash Photo by NOAA](https://images.unsplash.com/photo-1586771107445-d3ca888129ff)
- **Dimensions**: 800x600px (cropped)

### Mobile First Feature

- **Source**: [Unsplash Photo by Rahul Chakraborty](https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c)
- **Dimensions**: 800x600px (cropped)

### Community Support Feature

- **Source**: [Unsplash Photo by Annie Spratt](https://images.unsplash.com/photo-1542601906990-b4d3fb778b09)
- **Dimensions**: 800x600px (cropped)

All images are licensed under the Unsplash License and are free to use for both personal and commercial purposes.

## System Architecture

AgriSenti follows a modern client-server architecture designed for scalability and offline capability:

### Client-Side Architecture

- **Single Page Application (SPA)**: Built with React for smooth navigation without full page reloads
- **Responsive Design**: Mobile-first approach with adaptive layouts for all device sizes
- **Progressive Web App (PWA)**: Service workers enable offline functionality and improved performance
- **Local Storage**: Caches critical data for areas with intermittent connectivity
- **Lazy Loading**: Optimizes initial load time by only loading necessary components

### Server-Side Architecture

- **Serverless Backend**: Leverages Supabase for authentication, database, and storage
- **Edge Functions**: Processes data close to the user for reduced latency
- **Real-time Subscriptions**: Enables live updates for market prices and weather alerts
- **Microservices**: Modular API endpoints for disease detection, weather forecasts, and market data

## Troubleshooting

### Common Issues and Solutions

#### Authentication Issues

See the [Authentication Troubleshooting](#authentication-troubleshooting) section for detailed guidance.

#### Email Verification Problems

See the [Email Verification Troubleshooting](#email-verification-troubleshooting) section for detailed guidance.

#### AI Feature Issues

- Ensure the Gemini API key is properly set in your environment variables
- Check your API usage quotas if AI features stop working
- If experiencing slowness, consider implementing proper loading states
- For vision-related issues, ensure images are in a supported format and resolution

#### UI/UX Issues

- For display problems on mobile, ensure the viewport meta tag is properly set
- For component styling issues, check for Tailwind CSS class conflicts
- For form validation problems, verify React Hook Form and Zod schema setup

#### Performance Issues

- If the app is slow to load, implement code splitting and lazy loading
- If API calls are slow, implement proper caching with React Query
- For large data sets, implement pagination or virtualized lists

### Getting Help

If you encounter issues not covered in this documentation:

1. Check the browser console for detailed error messages
2. Look at the Network tab in developer tools for failed requests
3. Check the logs in your Supabase dashboard
4. Open an issue on the GitHub repository with detailed information about the problem

## Contributing

We welcome contributions to the AgriSenti project! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add some amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. Submit a **Pull Request**

### Development Guidelines

- Follow the established code style and organization
- Write meaningful commit messages
- Include documentation for new features
- Add or update tests as needed
- Ensure all tests pass before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Meet Our Team

The AgriSenti project is developed and maintained by a dedicated team with expertise in educational technology, AI systems, and user experience design:

- **Fakii Mohammed** - CEO  
  Visionary leader with extensive experience in educational technology and family-centered solutions

- **Andrew Ogembo** - CTO  
  Technical architect specializing in AI systems and scalable educational platforms

- **Chiboniso Nyoni** - User Experience Lead  
  UX expert focused on creating intuitive, family-friendly interfaces that make learning accessible

Our diverse team brings together experience in educational technology, AI systems, user experience design, and family-centered solutions to create a platform that empowers farmers through accessible and intuitive technology.

## Acknowledgments

- **Nakuru County Agricultural Office** for domain expertise and data validation
- **Local Farmer Cooperatives** for user testing and feedback
- **Kenya Meteorological Department** for weather data integration
- **The Agriculture and Food Authority (AFA)** for market price data
- **Google** for providing AI capabilities through the Gemini API
