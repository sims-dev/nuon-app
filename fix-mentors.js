const mongoose = require('mongoose');
require('dotenv').config();

async function fixMentors() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/neonclub';
    console.log('Connecting to MongoDB:', mongoUri);

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');

    // Import Mentor model
    const Mentor = require('./models/Mentor');

    // Find mentors with missing required fields
    const mentorsToFix = await Mentor.find({
      $or: [
        { isMentor: { $exists: false } },
        { isApproved: { $exists: false } },
        { isActive: { $exists: false } },
        { isPublic: { $exists: false } }
      ]
    });

    console.log('\n=== MENTOR FIX SCRIPT ===');
    console.log('Mentors needing fixes:', mentorsToFix.length);

    if (mentorsToFix.length > 0) {
      for (const mentor of mentorsToFix) {
        console.log(`\nFixing mentor: ${mentor.name} (${mentor._id})`);

        const updates = {};
        if (mentor.isMentor === undefined) {
          updates.isMentor = true;
          console.log('  ✅ Added isMentor: true');
        }
        if (mentor.isApproved === undefined) {
          updates.isApproved = true;
          console.log('  ✅ Added isApproved: true');
        }
        if (mentor.isActive === undefined) {
          updates.isActive = true;
          console.log('  ✅ Added isActive: true');
        }
        if (mentor.isPublic === undefined) {
          updates.isPublic = true;
          console.log('  ✅ Added isPublic: true');
        }

        await Mentor.findByIdAndUpdate(mentor._id, updates);
        console.log('  ✅ Mentor fixed successfully');
      }

      console.log('\n🎉 All mentors fixed!');
    } else {
      console.log('✅ No mentors need fixing.');
    }

    // Final count
    const totalMentors = await Mentor.countDocuments();
    const publicMentors = await Mentor.countDocuments({ isPublic: true, isActive: true });

    console.log('\n=== FINAL STATUS ===');
    console.log('Total mentors:', totalMentors);
    console.log('Public mentors:', publicMentors);

  } catch (error) {
    console.error('❌ Error fixing mentors:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

fixMentors();