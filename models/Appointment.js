const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  scheduledTime: { type: Date, required: true },
  estimatedEndTime: { type: Date, required: true },
  actualStartTime: Date,
  actualEndTime: Date,
  status: { 
    type: String, 
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  symptoms: [String],
  aiPreAssessment: {
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
    suggestedDuration: Number,
    recommendations: [String]
  },
  consultation: {
    diagnosis: String,
    prescription: [String],
    notes: String,
    followUpRequired: Boolean,
    followUpDate: Date
  },
  queuePosition: { type: Number, default: 0 },
  estimatedWaitTime: { type: Number, default: 0 } // minutes
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);