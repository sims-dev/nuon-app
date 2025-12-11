const mongoose = require('mongoose');
require('dotenv').config();

async function checkMentors() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/neonclub';
    console.log('Connecting to MongoDB:', mongoUri);

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');

    // Import Mentor model
    const Mentor = require('./models/Mentor');

    // Count total mentors
    const totalCount = await Mentor.countDocuments();
    console.log('\n=== MENTOR DATABASE CHECK ===');
    console.log('Total mentors in database:', totalCount);

    if (totalCount === 0) {
      console.log('❌ No mentors found in database. This explains why they are not displaying!');
      console.log('💡 Try adding a mentor through the admin dashboard now.');
    } else {
      // Get all mentors
      const mentors = await Mentor.find({});
      console.log('\n=== MENTOR DETAILS ===');

      mentors.forEach((mentor, index) => {
        console.log(`\nMentor ${index + 1}:`);
        console.log('  ID:', mentor._id);
        console.log('  Name:', mentor.name);
        console.log('  Email:', mentor.email);
        console.log('  isMentor:', mentor.isMentor);
        console.log('  isApproved:', mentor.isApproved);
        console.log('  isActive:', mentor.isActive);
        console.log('  isPublic:', mentor.isPublic);
        console.log('  Role:', mentor.role);
        console.log('  Specialization:', mentor.specialization);
        console.log('  Experience:', mentor.experience);
        console.log('  Hourly Rate:', mentor.hourlyRate);
      });

      // Check for mentors that should be visible
      const publicMentors = await Mentor.find({ isPublic: true, isActive: true });
      console.log('\n=== PUBLIC MENTORS (should appear in mobile app) ===');
      console.log('Public mentors count:', publicMentors.length);

      if (publicMentors.length === 0) {
        console.log('❌ No public mentors found. Mobile app will show empty list.');
        console.log('💡 Check if mentors have isPublic: true and isActive: true');
      } else {
        publicMentors.forEach((mentor, index) => {
          console.log(`Public Mentor ${index + 1}: ${mentor.name} (${mentor.email})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error checking mentors:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

checkMentors();