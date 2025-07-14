const Appointment = require('../models/Appointment');

class QueueManager {
  // Mark appointment as completed and reschedule queue
  static async completeAppointment(appointmentId, doctorId) {
    try {
      // Mark current appointment as completed
      const completedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { 
          status: 'completed',
          completedAt: new Date()
        },
        { new: true }
      );

      if (!completedAppointment) {
        throw new Error('Appointment not found');
      }

      // Get all pending appointments for this doctor today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const pendingAppointments = await Appointment.find({
        doctorId: doctorId,
        appointmentDate: { $gte: today, $lt: tomorrow },
        status: 'scheduled',
        appointmentTime: { $gt: completedAppointment.appointmentTime }
      }).sort({ appointmentTime: 1 });

      // Reschedule remaining appointments (move them earlier)
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      
      let newTime = new Date();
      newTime.setHours(currentHour, currentMinute + 15, 0, 0); // Start 15 minutes from now

      const rescheduledAppointments = [];

      for (const appointment of pendingAppointments) {
        const originalTime = appointment.appointmentTime;
        
        // Update appointment time
        appointment.appointmentTime = new Date(newTime);
        appointment.rescheduledFrom = originalTime;
        appointment.rescheduledReason = 'Previous consultation completed early';
        
        await appointment.save();
        rescheduledAppointments.push({
          appointmentId: appointment._id,
          patientId: appointment.patientId,
          originalTime: originalTime,
          newTime: new Date(newTime)
        });

        // Increment time by 30 minutes for next appointment
        newTime.setMinutes(newTime.getMinutes() + 30);
      }

      return {
        completedAppointment,
        rescheduledCount: rescheduledAppointments.length,
        rescheduledAppointments
      };

    } catch (error) {
      throw new Error(`Queue management error: ${error.message}`);
    }
  }

  // Get doctor's queue for today
  static async getDoctorQueue(doctorId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const appointments = await Appointment.find({
        doctorId: doctorId,
        appointmentDate: { $gte: today, $lt: tomorrow }
      })
      .populate('patientId', 'name phone email')
      .sort({ appointmentTime: 1 });

      const queue = appointments.map((apt, index) => ({
        _id: apt._id,
        patient: apt.patientId,
        appointmentTime: apt.appointmentTime,
        symptoms: apt.symptoms,
        status: apt.status,
        position: index + 1,
        isNext: index === 0 && apt.status === 'scheduled',
        estimatedWaitTime: index * 30, // 30 minutes per consultation
        rescheduledFrom: apt.rescheduledFrom,
        rescheduledReason: apt.rescheduledReason
      }));

      return {
        totalAppointments: queue.length,
        completed: queue.filter(q => q.status === 'completed').length,
        pending: queue.filter(q => q.status === 'scheduled').length,
        currentPatient: queue.find(q => q.isNext),
        queue
      };

    } catch (error) {
      throw new Error(`Queue fetch error: ${error.message}`);
    }
  }

  // Notify patients about reschedule
  static async notifyRescheduledPatients(rescheduledAppointments, io) {
    for (const reschedule of rescheduledAppointments) {
      // Emit real-time notification
      io.emit('appointmentRescheduled', {
        patientId: reschedule.patientId,
        appointmentId: reschedule.appointmentId,
        originalTime: reschedule.originalTime,
        newTime: reschedule.newTime,
        message: 'Good news! Your appointment has been moved to an earlier time.'
      });
    }
  }
}

module.exports = QueueManager;