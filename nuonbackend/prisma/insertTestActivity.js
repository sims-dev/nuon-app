const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const activity = await prisma.engageActivity.create({
      data: {
        title: 'Test Activity from script',
        description: 'This is a test activity inserted by script for verification.',
        category: 'wellness',
        type: 'Yoga',
        date: new Date(),
        time: '10:00 AM',
        duration: '60',
        location: 'Online',
        price: 0,
        points: 50,
        image: null,
        thumbnail: null,
        videoUrl: null,
        videoTitle: null,
        videoDuration: null,
        videoQuality: null,
        instructorName: 'Scripted Instructor',
        capacity: 30,
        status: 'active',
        tags: 'test,script',
        isActive: true
      }
    });

    console.log('Created activity:', activity);
  } catch (err) {
    console.error('Error creating activity:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
