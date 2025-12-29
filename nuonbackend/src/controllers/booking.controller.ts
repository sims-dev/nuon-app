import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('mentor')
export class BookingController {
  constructor(private prisma: PrismaService) {}

  @Post('book-session')
  @UseGuards(JwtAuthGuard)
  async bookSession(@Body() body: { availabilityId: number }, @Req() req) {
    try {
      const { availabilityId } = body;
      const nurseId = req.user.id;

      const availability = await this.prisma.mentorAvailability.findUnique({
        where: { id: BigInt(availabilityId) },
        include: { mentor: true }
      });

      if (!availability || availability.currentBookings >= (availability.maxBookings || 1)) {
        return { success: false, message: 'No slots available' };
      }

      const booking = await this.prisma.booking.create({
        data: {
          nurse: { connect: { id: nurseId } },
          mentor: { connect: { id: availability.mentorId } },
          mentorAvailability: { connect: { id: BigInt(availabilityId) } },
          dateTime: availability.startDateTime
        }
      });

      await this.prisma.mentorAvailability.update({
        where: { id: BigInt(availabilityId) },
        data: { currentBookings: { increment: 1 } }
      });

      // Emit socket event to mentor
      const io = (global as any).io;
      io.to(`mentor_${availability.mentorId}`).emit('new_booking', {
        booking,
        user: req.user
      });

      return { success: true, booking };
    } catch (error) {
      console.error('Error booking session:', error);
      return { success: false, message: 'Failed to book session' };
    }
  }

  @Get('bookings')
  @UseGuards(JwtAuthGuard)
  async getMyBookings(@Req() req) {
    try {
      const userId = req.user.id;
      const bookings = await this.prisma.booking.findMany({
        where: { nurseId: userId },
        include: {
          mentorAvailability: {
            include: {
              mentor: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  @Get('availability/:mentorId')
  async fetchMentorAvailability(@Param('mentorId') mentorId: string) {
    try {
      const availabilities = await this.prisma.mentorAvailability.findMany({
        where: { mentorId: parseInt(mentorId), isActive: true },
        orderBy: { startDateTime: 'asc' }
      });
      return { slots: availabilities };
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw new Error('Failed to fetch availability');
    }
  }
}