# Neon Club Mobile App Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development - Mac only)
- Physical device or emulator

## Installation Steps

### 1. Install Dependencies
```bash
cd neon-club-mobile/NeonClubMobile
npm install
```

### 2. Configure API Connection
1. Open `src/utils/config.js`
2. Replace `192.168.1.100` with your actual local network IP address
3. To find your IP:
   - Windows: Run `ipconfig` in Command Prompt
   - Mac/Linux: Run `ifconfig` in Terminal
   - Look for IPv4 Address

### 3. Start Backend Server
Make sure your backend server is running:
```bash
cd ../../
npm start
```
The server should be running on port 5000.

### 4. Android Setup

#### For Physical Device:
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `npx react-native run-android`

#### For Android Emulator:
1. Open Android Studio
2. Start an Android Virtual Device (AVD)
3. Update config.js to use: `http://10.0.2.2:5000/api`
4. Run: `npx react-native run-android`

### 5. iOS Setup (Mac only)

#### For Physical Device:
1. Open `ios/NeonClubMobile.xcworkspace` in Xcode
2. Select your device
3. Build and run

#### For iOS Simulator:
1. Update config.js to use: `http://localhost:5000/api`
2. Run: `npx react-native run-ios`

## App Features

### Authentication
- Nurse registration and login
- JWT token-based authentication
- Role-based access (nurses only)

### Main Features
1. **Browse Catalog** - View courses, events, workshops
2. **Mentorship** - Book sessions with mentors
3. **Bookings** - View and manage bookings
4. **Assessments** - Take knowledge tests
5. **NCC Challenge** - 3-step certification program
6. **Profile** - View progress and account details

### NCC (Nightingale Champion Challenge)
Three-step process:
1. **Assessment** - Complete nursing knowledge test
2. **Interview** - Zoom video interview
3. **Leadership Program** - Complete leadership training

## API Endpoints Used

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/user/me` - Get user profile
- `GET /api/courses` - Get courses catalog
- `POST /api/courses/purchase` - Purchase course
- `GET /api/courses/my-courses` - Get user's courses
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/assessments` - Get assessments
- `POST /api/assessments/:id/submit` - Submit assessment
- `GET /api/ncc` - Get NCC status
- `POST /api/ncc/step` - Update NCC step
- `POST /api/payments/initiate` - Initiate payment

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

3. **Network connection issues**
   - Ensure backend server is running
   - Check IP address in config.js
   - Ensure device/emulator can reach the server

4. **Authentication issues**
   - Clear app data/storage
   - Check JWT token expiration
   - Verify user role is 'nurse'

### Testing the App

1. **Register a new nurse account**
2. **Login with credentials**
3. **Browse catalog and view course details**
4. **Book a mentorship session**
5. **Take an assessment**
6. **Check NCC progress**
7. **View profile and logout**

## Development Notes

- The app uses React Navigation for screen navigation
- AsyncStorage for local data persistence
- Axios for API communication
- Real-time updates when connected to backend
- Payment integration ready (Razorpay/Stripe)

## Building APK for Distribution

### Debug APK
```bash
cd android
./gradlew assembleDebug
```
APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Next Steps

1. Test all features with backend
2. Configure payment gateways
3. Add push notifications
4. Implement video calling for mentorship
5. Add offline support
6. Optimize performance
7. Add analytics tracking

## Support

For issues or questions:
1. Check console logs for errors
2. Verify backend API responses
3. Test network connectivity
4. Check device/emulator compatibility