# 🌍 Vehicle Emissions Monitoring Dashboard

A real-time, production-ready dashboard for monitoring vehicle emissions across multiple monitoring stations. Built with React and designed for both technical and non-technical users, this dashboard provides comprehensive air quality tracking with intuitive visualizations and actionable insights.

![Dashboard Preview](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Components Breakdown](#components-breakdown)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Styling & Design](#styling--design)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The Vehicle Emissions Monitoring Dashboard is a sophisticated web application designed to track, visualize, and analyze air quality data from multiple vehicle emission monitoring devices. The dashboard provides real-time insights into Carbon Monoxide (CO) and Carbon Dioxide (CO₂) levels across various locations, helping environmental agencies, city planners, and public health officials make data-driven decisions.

### Key Objectives

- **Real-Time Monitoring:** Automatic data refresh every 30 seconds to ensure up-to-date information
- **Accessibility:** Non-technical explanations for all metrics and visualizations
- **Actionable Insights:** Color-coded status indicators and trend forecasting
- **Responsive Design:** Seamless experience across desktop, tablet, and mobile devices
- **Data Integrity:** Robust error handling and fallback mechanisms

---

## ✨ Features

### 1. **Live Summary Cards**
Three prominent cards displaying critical real-time metrics:

- **Carbon Monoxide (CO) Level**
  - Current reading in parts per million (ppm)
  - Plain-language explanation of air quality impact
  - Visual status indicator (Green/Yellow/Red)
  
- **Carbon Dioxide (CO₂) Level**
  - Current reading in parts per million (ppm)
  - Context about atmospheric conditions
  - Recommendations for ventilation
  
- **Overall Emission Status**
  - Aggregated assessment across all parameters
  - Color-coded border for quick visual identification
  - Status categories: Good, Moderate, Alert

### 2. **Interactive Time-Series Charts**

#### CO Trend Over Time
- Line chart displaying the last 20 readings
- X-axis: Time (hourly intervals)
- Y-axis: CO concentration (ppm)
- Interactive tooltips on hover
- Smooth animations and transitions

#### CO₂ Trend Over Time
- Line chart showing CO₂ levels over time
- Identifies peak traffic hours and patterns
- Helps correlate emission spikes with events

### 3. **Distribution Visualization**

#### Devices by Emission Status (Pie Chart)
- Visual breakdown of monitoring device statuses
- Shows percentage of devices in Good, Moderate, and Alert states
- Modern color palette with distinct, accessible colors
- Interactive labels with device counts

### 4. **Predictive Forecasting**

A simple trend analysis module that:
- Analyzes the last 5 data points
- Identifies directional trends (UP/DOWN)
- Calculates rate of change
- Provides plain-language predictions
- Offers contextual recommendations based on trends

### 5. **Comprehensive Data Table**

- Displays the 15 most recent readings
- Columns: Device ID, CO, CO₂, Location, Timestamp, Status
- Status badges with color coding
- Sortable and scrollable for easy navigation
- Responsive design for mobile viewing

### 6. **Auto-Refresh Mechanism**

- Polls data every 30 seconds using `setInterval`
- Displays "Last Updated" timestamp
- Graceful error handling with retry logic
- Loading states during data fetch

### 7. **Non-Technical Explanations**

Every metric includes contextual information:
- **What the numbers mean** in practical terms
- **Health implications** for different exposure levels
- **Recommended actions** based on current readings
- **Pattern explanations** for trend charts

---

## 🛠 Technology Stack

### Frontend
- **React 18.x** - Core UI framework using functional components and Hooks
- **Recharts 2.x** - Declarative charting library for data visualization
- **CSS-in-JS** - Inline styles for component-level styling
- **Inter Font Family** - Modern, accessible typography

### Backend & Infrastructure
- **AWS DynamoDB** - NoSQL database for emission readings
- **AWS Amplify** - Hosting, CI/CD, and deployment pipeline
- **AWS SDK for JavaScript** - DynamoDB client library

### Development Tools
- **Create React App** - Build toolchain and development server
- **npm/npx** - Package management
- **Git** - Version control
- **ESLint** - Code quality and consistency

### Data Flow
```
Monitoring Devices → AWS IoT Core → DynamoDB → React App → User Browser
```

---

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Browser                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           React Single Page Application             │   │
│  │                                                      │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │   │
│  │  │ Summary  │  │  Charts  │  │  Table   │         │   │
│  │  │  Cards   │  │Component │  │Component │         │   │
│  │  └──────────┘  └──────────┘  └──────────┘         │   │
│  │                                
