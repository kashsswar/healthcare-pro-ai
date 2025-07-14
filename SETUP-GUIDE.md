# 🚀 HealthCare Pro Setup Guide

## ⚡ Quick Setup (Recommended)

**One-click installation:**
```bash
quick-setup.bat
```

This automatically:
- ✅ Installs MongoDB Community Server
- ✅ Installs all dependencies (backend + frontend)
- ✅ Creates sample data (10 doctors + 1 patient)
- ✅ Starts both servers

## 📋 What You Get

### Sample Doctors Created:
1. **Dr. Sarah Johnson** - General Medicine (Featured)
2. **Dr. Michael Chen** - Dentistry (Boosted)
3. **Dr. Priya Sharma** - Cardiology
4. **Dr. Rajesh Kumar** - Orthopedic Surgery
5. **Dr. Anita Desai** - Pediatrics (Featured)
6. **Dr. Vikram Singh** - Dermatology
7. **Dr. Meera Patel** - Gynecology
8. **Dr. Arjun Reddy** - Neurology (Rating Boosted)
9. **Dr. Kavya Nair** - Ophthalmology
10. **Dr. Suresh Gupta** - ENT

### Test Accounts:
- **Patient**: patient@test.com / password123
- **Doctor**: sarah.johnson@healthconnect.com / password123
- **Admin**: Access via /secret-admin-portal-2024

## 🔧 Manual Setup (Alternative)

### Step 1: MongoDB
```bash
auto-install-mongodb.bat
```

### Step 2: Dependencies
```bash
npm install
cd client && npm install
```

### Step 3: Sample Data
```bash
node setup.js
```

### Step 4: Start Servers
```bash
# Backend
npm run dev

# Frontend (new terminal)
cd client && npm start
```

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/secret-admin-portal-2024

## 🎯 Features Ready to Test

### Specialization System:
- 75+ medical specializations
- Searchable registration dropdown
- Custom specialization support
- AI validation

### Doctor Search:
- Search by name or specialization
- Filter by medical field
- Featured/boosted doctors appear first
- Real-time availability status

### Admin Features:
- Doctor boost management
- Searchable doctor list
- Revenue tracking (20% commission)
- Real-time analytics

## 🚀 Ready to Use!

After setup, you can immediately:
1. Register new doctors with any specialization
2. Search and book appointments as patients
3. Manage doctors and earnings as admin
4. Test all AI-powered features

**Total setup time: 5-10 minutes with quick-setup.bat**