const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Mentor = require('./models/Mentor');
require('dotenv').config();

const createDemoMentor = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const mentorEmail = 'mentor-demo@neonclub.com';
    const mentorPassword = 'password123';

    // Delete existing demo mentor if exists
    await User.deleteMany({ email: mentorEmail });
    await Mentor.deleteMany({ email: mentorEmail });
    console.log('Deleted existing demo mentor');

    // Create User document
    const hashedPassword = await bcrypt.hash(mentorPassword, 10);
    const user = new User({
      name: 'Dr. Sunita Verma',
      email: mentorEmail,
      passwordHash: hashedPassword,
      role: 'mentor',
      specialization: 'Critical Care Nursing',
      experience: 15,
      location: 'Mumbai, Maharashtra',
      city: 'Mumbai',
      state: 'Maharashtra',
      organization: 'AIIMS Mumbai',
      qualification: 'MD Critical Care',
      department: 'Critical Care',
      hospital: 'AIIMS Mumbai',
      bio: 'Experienced critical care nurse with 15+ years in emergency medicine. Passionate about mentoring young nurses.',
      hourlyRate: 2000,
      availability: 'available',
      isProfileComplete: true
    });

    await user.save();
    console.log(`✅ User created: ${mentorEmail}`);

    // Create Mentor document
    const mentor = new Mentor({
      name: 'Dr. Sunita Verma',
      email: mentorEmail,
      phone: '+91-9876543210',
      specialization: ['Critical Care Nursing', 'Emergency Medicine'],
      qualification: 'MD Critical Care',
      department: 'Critical Care',
      hospital: 'AIIMS Mumbai',
      experience: 15,
      bio: 'Experienced critical care nurse with 15+ years in emergency medicine. Passionate about mentoring young nurses.',
      hourlyRate: 2000,
      availability: 'available',
      profilePicture: 'https://via.placeholder.com/150x150',
      rating: 4.8,
      totalSessions: 340,
      completedSessions: 320,
      totalStudents: 45,
      location: 'Mumbai, Maharashtra',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      isMentor: true,
      isApproved: true,
      isActive: true,
      isPublic: true,
      role: 'mentor',
      languages: ['English', 'Hindi'],
      teachingStyle: 'Interactive and practical',
      preferredTopics: ['Emergency Response', 'Patient Assessment', 'Critical Care Protocols'],
      isVerified: true,
      isProfileComplete: true
    });

    await mentor.save();
    console.log(`✅ Mentor profile created: ${mentorEmail}`);
    console.log(`🔑 Password: ${mentorPassword}`);

    // Test the password
    const testUser = await User.findOne({ email: mentorEmail });
    const isValidPassword = await bcrypt.compare(mentorPassword, testUser.passwordHash);
    console.log(`🔍 Password test: ${isValidPassword ? 'PASS' : 'FAIL'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createDemoMentor();