const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const cron = require('node-cron');

class SchedulingService {
  // Dynamic queue management
  static async updateQueue(doctorId) {
    const appointments = await Appointment.find({
      doctor: doctorId,
      status: { $in: ['scheduled', 'in-progress'] },
      scheduledTime: { $gte: new Date() }
    }).sort({ scheduledTime: 1 });

    let currentTime = new Date();
    let position = 1;

    for (const appointment of appointments) {
      appointment.queuePosition = position;
      appointment.estimatedWaitTime = Math.max(0, 
        Math.round((currentTime - new Date()) / (1000 * 60))
      );
      
      await appointment.save();
      
      // Add estimated consultation time for next appointment
      currentTime = new Date(currentTime.getTime() + 
        (appointment.aiPreAssessment?.suggestedDuration || 30) * 60000
      );
      position++;
    }

    return appointments;
  }

  // Auto-reschedule when appointments run over
  static async handleAppointmentDelay(appointmentId, delayMinutes) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return;

    // Update all subsequent appointments
    const subsequentAppointments = await Appointment.find({
      doctor: appointment.doctor,
      scheduledTime: { $gt: appointment.scheduledTime },
      status: 'scheduled'
    }).sort({ scheduledTime: 1 });

    for (const nextAppointment of subsequentAppointments) {
      nextAppointment.scheduledTime = new Date(
        nextAppointment.scheduledTime.getTime() + delayMinutes * 60000
      );
      nextAppointment.estimatedEndTime = new Date(
        nextAppointment.estimatedEndTime.getTime() + delayMinutes * 60000
      );
      await nextAppointment.save();

      // Notify patient via socket
      const io = require('../server').io;
      io.to(`appointment-${nextAppointment._id}`).emit('appointment-rescheduled', {
        newTime: nextAppointment.scheduledTime,
        delay: delayMinutes,
        message: `Your appointment has been rescheduled due to previous consultation running over.`
      });
    }
  }

  // Find optimal appointment slot
  static async findOptimalSlot(doctorId, preferredDate, estimatedDuration) {
    const doctor = await Doctor.findById(doctorId);
    const dayOfWeek = preferredDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    const availability = doctor.availability.find(a => a.day === dayOfWeek);
    if (!availability || !availability.isAvailable) {
      return null;
    }

    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      scheduledTime: {
        $gte: new Date(preferredDate.setHours(0, 0, 0, 0)),
        $lt: new Date(preferredDate.setHours(23, 59, 59, 999))
      },
      status: { $ne: 'cancelled' }
    }).sort({ scheduledTime: 1 });

    // Find gaps in schedule
    const [startHour, startMin] = availability.startTime.split(':').map(Number);
    const [endHour, endMin] = availability.endTime.split(':').map(Number);
    
    let currentSlot = new Date(preferredDate);
    currentSlot.setHours(startHour, startMin, 0, 0);
    
    const endTime = new Date(preferredDate);
    endTime.setHours(endHour, endMin, 0, 0);

    for (const appointment of existingAppointments) {
      if (currentSlot < appointment.scheduledTime) {
        const availableTime = (appointment.scheduledTime - currentSlot) / (1000 * 60);
        if (availableTime >= estimatedDuration) {
          return currentSlot;
        }
      }
      currentSlot = new Date(appointment.estimatedEndTime);
    }

    // Check if there's time after last appointment
    if (currentSlot < endTime) {
      const remainingTime = (endTime - currentSlot) / (1000 * 60);
      if (remainingTime >= estimatedDuration) {
        return currentSlot;
      }
    }

    return null;
  }

  // Update doctor's average consultation time
  static async updateDoctorStats(doctorId, actualDuration) {
    const doctor = await Doctor.findById(doctorId);
    const completedAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: 'completed'
    });

    // Calculate new average
    const currentAvg = doctor.avgConsultationTime || 30;
    const newAvg = Math.round(
      (currentAvg * completedAppointments + actualDuration) / (completedAppointments + 1)
    );

    await Doctor.findByIdAndUpdate(doctorId, {
      avgConsultationTime: newAvg,
      totalPatients: completedAppointments + 1
    });
  }
}

// Cron job to update queues every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    const doctors = await Doctor.find({});
    for (const doctor of doctors) {
      await SchedulingService.updateQueue(doctor._id);
    }
  } catch (error) {
    console.error('Queue update error:', error);
  }
});

module.exports = SchedulingService;