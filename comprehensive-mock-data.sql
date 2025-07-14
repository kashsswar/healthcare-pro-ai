-- HealthCare Pro - Comprehensive Mock Data
-- Professional Healthcare Platform Test Database

-- ADMIN USERS
INSERT INTO users (id, name, email, password, role, created_at) VALUES
('admin_001', 'Super Admin', 'admin@healthcarepro.com', 'admin123', 'admin', NOW()),
('admin_002', 'Platform Manager', 'manager@healthcarepro.com', 'manager123', 'admin', NOW());

-- DOCTORS (Multiple Specializations)
INSERT INTO users (id, name, email, password, role, phone, created_at) VALUES
('doc_001', 'Dr. Rajesh Kumar Sharma', 'dr.rajesh@healthcarepro.com', 'doctor123', 'doctor', '+91-9876543210', NOW()),
('doc_002', 'Dr. Priya Patel', 'dr.priya@healthcarepro.com', 'doctor123', 'doctor', '+91-9876543211', NOW()),
('doc_003', 'Dr. Amit Singh', 'dr.amit@healthcarepro.com', 'doctor123', 'doctor', '+91-9876543212', NOW()),
('doc_004', 'Dr. Sunita Devi', 'dr.sunita@healthcarepro.com', 'doctor123', 'doctor', '+91-9876543213', NOW()),
('doc_005', 'Dr. Vikram Gupta', 'dr.vikram@healthcarepro.com', 'doctor123', 'doctor', '+91-9876543214', NOW()),
('doc_006', 'Dr. Meera Joshi', 'dr.meera@healthcarepro.com', 'doctor123', 'doctor', '+91-9876543215', NOW()),
('doc_007', 'Dr. Ravi Verma', 'dr.ravi@healthcarepro.com', 'doctor123', 'doctor', '+91-9876543216', NOW()),
('doc_008', 'Dr. Kavita Sharma', 'dr.kavita@healthcarepro.com', 'doctor123', 'doctor', '+91-9876543217', NOW());

-- DOCTOR PROFILES
INSERT INTO doctors (user_id, specialization, qualification, experience, rating, consultation_fee, location, category, verified, created_at) VALUES
('doc_001', 'General Medicine', 'MBBS, MD Internal Medicine', 12, 4.3, 800, 'Mumbai, Maharashtra', 'general', true, NOW()),
('doc_002', 'Dentistry', 'BDS, MDS Oral Surgery', 8, 4.1, 1200, 'Delhi, NCR', 'dental', true, NOW()),
('doc_003', 'Cardiology', 'MBBS, MD Cardiology, DM', 15, 4.7, 1500, 'Bangalore, Karnataka', 'specialist', true, NOW()),
('doc_004', 'Pediatrics', 'MBBS, MD Pediatrics', 10, 4.6, 700, 'Pune, Maharashtra', 'child', true, NOW()),
('doc_005', 'Gynecology', 'MBBS, MS Gynecology', 14, 4.8, 900, 'Chennai, Tamil Nadu', 'women', true, NOW()),
('doc_006', 'Orthopedics', 'MBBS, MS Orthopedics', 18, 4.5, 1000, 'Hyderabad, Telangana', 'bones', true, NOW()),
('doc_007', 'Dermatology', 'MBBS, MD Dermatology', 9, 4.4, 800, 'Ahmedabad, Gujarat', 'skin', true, NOW()),
('doc_008', 'Psychiatry', 'MBBS, MD Psychiatry', 11, 4.3, 1100, 'Kolkata, West Bengal', 'mental', true, NOW());

-- PATIENTS (Diverse Demographics)
INSERT INTO users (id, name, email, password, role, phone, age, location, created_at) VALUES
('pat_001', 'Amit Singh', 'amit.singh@email.com', 'patient123', 'patient', '+91-9876543220', 32, 'Mumbai, Maharashtra', NOW()),
('pat_002', 'Sunita Devi', 'sunita.devi@email.com', 'patient123', 'patient', '+91-9876543221', 45, 'Delhi, NCR', NOW()),
('pat_003', 'Rahul Sharma', 'rahul.sharma@email.com', 'patient123', 'patient', '+91-9876543222', 28, 'Bangalore, Karnataka', NOW()),
('pat_004', 'Priya Gupta', 'priya.gupta@email.com', 'patient123', 'patient', '+91-9876543223', 35, 'Pune, Maharashtra', NOW()),
('pat_005', 'Ravi Kumar', 'ravi.kumar@email.com', 'patient123', 'patient', '+91-9876543224', 52, 'Chennai, Tamil Nadu', NOW()),
('pat_006', 'Anita Patel', 'anita.patel@email.com', 'patient123', 'patient', '+91-9876543225', 29, 'Hyderabad, Telangana', NOW()),
('pat_007', 'Suresh Jain', 'suresh.jain@email.com', 'patient123', 'patient', '+91-9876543226', 41, 'Ahmedabad, Gujarat', NOW()),
('pat_008', 'Kavita Roy', 'kavita.roy@email.com', 'patient123', 'patient', '+91-9876543227', 38, 'Kolkata, West Bengal', NOW()),
('pat_009', 'Deepak Yadav', 'deepak.yadav@email.com', 'patient123', 'patient', '+91-9876543228', 26, 'Jaipur, Rajasthan', NOW()),
('pat_010', 'Neha Agarwal', 'neha.agarwal@email.com', 'patient123', 'patient', '+91-9876543229', 31, 'Lucknow, Uttar Pradesh', NOW());

-- APPOINTMENTS (Various Statuses)
INSERT INTO appointments (id, patient_id, doctor_id, scheduled_time, status, symptoms, consultation_fee, payment_status, created_at) VALUES
('apt_001', 'pat_001', 'doc_001', '2024-01-15 10:00:00', 'completed', 'fever, headache', 800, 'paid', NOW()),
('apt_002', 'pat_002', 'doc_002', '2024-01-15 11:00:00', 'completed', 'tooth pain', 1200, 'paid', NOW()),
('apt_003', 'pat_003', 'doc_003', '2024-01-15 14:00:00', 'scheduled', 'chest pain', 1500, 'paid', NOW()),
('apt_004', 'pat_004', 'doc_004', '2024-01-15 15:00:00', 'in-progress', 'child fever', 700, 'paid', NOW()),
('apt_005', 'pat_005', 'doc_005', '2024-01-15 16:00:00', 'scheduled', 'pregnancy checkup', 900, 'paid', NOW());

-- BANK DETAILS (Doctors)
INSERT INTO doctor_bank_details (doctor_id, account_number, ifsc_code, bank_name, account_holder_name, verified, created_at) VALUES
('doc_001', 'ACC001234567890', 'HDFC0001234', 'HDFC Bank', 'Dr. Rajesh Kumar Sharma', true, NOW()),
('doc_002', 'ACC001234567891', 'ICIC0001235', 'ICICI Bank', 'Dr. Priya Patel', true, NOW()),
('doc_003', 'ACC001234567892', 'SBI0001236', 'State Bank of India', 'Dr. Amit Singh', true, NOW()),
('doc_004', 'ACC001234567893', 'AXIS0001237', 'Axis Bank', 'Dr. Sunita Devi', true, NOW());

-- PAYMENT TRANSACTIONS
INSERT INTO payments (id, appointment_id, patient_id, doctor_id, total_amount, doctor_amount, admin_amount, payment_method, status, created_at) VALUES
('pay_001', 'apt_001', 'pat_001', 'doc_001', 800, 640, 160, 'card', 'completed', NOW()),
('pay_002', 'apt_002', 'pat_002', 'doc_002', 1200, 960, 240, 'card', 'completed', NOW()),
('pay_003', 'apt_003', 'pat_003', 'doc_003', 1500, 1200, 300, 'card', 'completed', NOW()),
('pay_004', 'apt_004', 'pat_004', 'doc_004', 700, 560, 140, 'card', 'completed', NOW()),
('pay_005', 'apt_005', 'pat_005', 'doc_005', 900, 720, 180, 'card', 'completed', NOW());

-- ADMIN EARNINGS SUMMARY
INSERT INTO admin_earnings (date, total_consultations, total_revenue, admin_commission, created_at) VALUES
('2024-01-15', 25, 20000, 4000, NOW()),
('2024-01-14', 30, 24000, 4800, NOW()),
('2024-01-13', 28, 22400, 4480, NOW()),
('2024-01-12', 32, 25600, 5120, NOW()),
('2024-01-11', 27, 21600, 4320, NOW());

-- MARKETING CAMPAIGNS
INSERT INTO marketing_campaigns (id, name, type, status, target_reach, current_reach, roi_percentage, created_at) VALUES
('camp_001', 'WhatsApp Health Tips', 'whatsapp', 'active', 1000, 850, 340, NOW()),
('camp_002', 'Doctor Testimonials', 'social', 'active', 100, 45, 280, NOW()),
('camp_003', 'Referral Rewards', 'referral', 'active', 500, 234, 450, NOW()),
('camp_004', 'Medical College Outreach', 'education', 'ready', 200, 0, 0, NOW());

-- DOCTOR REVIEWS
INSERT INTO reviews (id, patient_id, doctor_id, appointment_id, rating, comment, created_at) VALUES
('rev_001', 'pat_001', 'doc_001', 'apt_001', 5, 'Excellent doctor, very professional', NOW()),
('rev_002', 'pat_002', 'doc_002', 'apt_002', 4, 'Good treatment, solved my tooth problem', NOW()),
('rev_003', 'pat_003', 'doc_003', 'apt_003', 5, 'Best cardiologist, highly recommended', NOW());

-- SYSTEM ANALYTICS
INSERT INTO system_analytics (date, new_doctors, new_patients, total_appointments, platform_revenue, created_at) VALUES
('2024-01-15', 3, 12, 25, 20000, NOW()),
('2024-01-14', 2, 15, 30, 24000, NOW()),
('2024-01-13', 1, 10, 28, 22400, NOW());

-- Test Credentials Summary:
-- ADMIN: admin@healthcarepro.com / admin123
-- DOCTORS: dr.rajesh@healthcarepro.com / doctor123 (and 7 more)
-- PATIENTS: amit.singh@email.com / patient123 (and 9 more)
-- SECRET ADMIN URL: /secret-admin-portal-2024
-- ADMIN CREDENTIALS: superadmin2024 / MyHealthApp@2024! / HEALTH_ADMIN_SECRET_2024