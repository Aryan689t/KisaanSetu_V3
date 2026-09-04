🌾 KisanSetu

A smart procurement-center management platform designed to reduce congestion and improve the crop procurement experience for farmers.

Built by CodeBusters for Smart India Hackathon 2026
Problem Statement: SIH26032

📌 Problem Statement

During crop procurement seasons, farmers often face long waiting times, overcrowded procurement centers, lack of real-time information, and uncertainty about when they should visit a center.

Procurement-center staff also face difficulties managing incoming farmers and handling sudden increases in demand during peak procurement periods.

Key challenges
Long queues and waiting times
Overcrowding at procurement centers
Farmers lack visibility into current center conditions
Sudden spikes in farmer arrivals
Difficulty managing procurement-center capacity
Limited accessibility for farmers who may not use smartphones
💡 Our Solution — KisanSetu

KisanSetu is a smart procurement-center management platform that connects farmers with procurement centers and provides better visibility into center activity.

Instead of farmers simply arriving at a center and waiting in an unpredictable queue, KisanSetu aims to provide them with useful information beforehand so they can make better decisions.

The system also provides tools for procurement-center staff and walk-in desks to manage the flow of farmers more efficiently.

How it works
Farmer
   ↓
KisanSetu
   ↓
Procurement Center Information
   ↓
Center Status / Expected Waiting
   ↓
Farmer makes an informed decision
   ↓
Procurement Center


✨ Key Features
👨‍🌾 Farmer
View available procurement centers
Check procurement-center status
View expected congestion/waiting conditions
Access relevant procurement information
Simple and accessible interface
Designed with farmers who may have limited technical familiarity in mind
🏢 Procurement Center
Monitor incoming farmers
Manage procurement activity
Track center capacity
Update operational status
Monitor current center conditions
Help manage farmer flow during peak periods
🧑‍💼 Walk-in Desk

The Walk-in Desk is designed for farmers who do not have smartphones or are unable/unwilling to use the application themselves.

Walk-in staff can assist farmers by:

Registering walk-in farmers
Entering farmer/crop information
Checking procurement-center availability
Providing information about waiting conditions
Assisting farmers with the procurement process
Helping manage farmers who arrive without prior digital registration

This allows KisanSetu to remain useful even for farmers who are not digitally connected.

🤖 Smart / Automation Features

If implemented in the current prototype:

Center congestion monitoring
Intelligent farmer-flow management
Center load monitoring
Real-time operational information
Recommendations based on center conditions

Note: Only list features here that are actually implemented or clearly mark unfinished features as planned.

🧠 What Makes KisanSetu Different?

Existing procurement systems often focus primarily on record keeping and administrative operations.

KisanSetu focuses more directly on the movement and experience of farmers around procurement centers.

Our approach aims to reduce congestion by providing information and managing farmer flow before overcrowding becomes a major problem.

Existing Approach	KisanSetu
Primarily center-focused	Farmer + center focused
Limited visibility for farmers	Farmer-facing center information
Reactive congestion management	Proactive farmer-flow management
Digital-only interaction can exclude some farmers	Walk-in Desk supports offline users
Static information	Dynamic operational information
🏗️ System Architecture
                    ┌──────────────────┐
                    │     Farmers      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   KisanSetu UI   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Backend API   │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
        ┌──────────────┐          ┌──────────────┐
        │   Database   │          │ Smart Logic  │
        └──────────────┘          └──────────────┘


     ┌──────────────────┐
     │  Walk-in Desk    │
     └────────┬─────────┘
              │
              ▼
       ┌──────────────┐
       │   Backend    │
       └──────────────┘


     ┌──────────────────┐
     │ Procurement      │
     │ Center Staff     │
     └────────┬─────────┘
              │
              ▼
       ┌──────────────┐
       │   Backend    │
       └──────────────┘
🛠️ Tech Stack
Technology	Purpose
React	Frontend
JavaScript	Application logic
Node.js	Backend
Express.js	API layer
Supabase	Database / backend services
Vercel	Deployment
Git & GitHub	Version control



🚀 Getting Started
Prerequisites

Make sure you have:

Node.js
npm
Git
Installation
git clone <repository-url>
cd KisanSetu
npm install
Run Locally
npm run dev

The application will then be available at:

http://localhost:5173
📸 Screenshots / Demo
👨‍🌾 Farmer Dashboard

🏢 Procurement Center

🧑‍💼 Walk-in Desk

🌐 Live Demo

Live Application: <your-vercel-link>

🔄 User Flow
Farmer Flow
Farmer
   ↓
Opens KisanSetu
   ↓
Views procurement centers
   ↓
Checks center status
   ↓
Checks expected congestion / waiting
   ↓
Chooses a suitable center/time
   ↓
Visits procurement center
   ↓
Crop Procurement
Walk-in Farmer Flow
Farmer without smartphone
          ↓
      Walk-in Desk
          ↓
  Staff enters information
          ↓
 Checks center availability
          ↓
 Provides relevant information
          ↓
 Farmer proceeds with procurement
Procurement Center Flow
Procurement Center
        ↓
Updates center activity
        ↓
Backend processes information
        ↓
Center status updated
        ↓
Farmer / Walk-in Desk receives
updated information
🔮 Future Scope

KisanSetu can be expanded with:

IVR / voice-based access for farmers without smartphones
SMS-based notifications
More comprehensive multilingual support
Integration with government procurement data
ML-based congestion prediction
Offline and low-connectivity support
Integration with additional procurement centers
Automated farmer-flow recommendations
Historical procurement and congestion analytics

👥 Team

CodeBusters

Member	Role
Aryan	Team Lead / Full Stack
Sanchit Marwah
Aman Kumar Yadav
sristi
Shreyansh Kumar
Sanchit Prajapati

📜 License

This project was developed as a prototype for Smart India Hackathon 2026.
