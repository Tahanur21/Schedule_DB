// ═══════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE MOCK DATA FOR ACADEMIC SCHEDULE MANAGEMENT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────────────────
// 👥 USER DATA
// ────────────────────────────────────────────────────────────────────────────
export const mockUsers = [
  // Admin Users
  { id: 1, name: "Dr. Hassan Ahmed", email: "admin@university.edu", password: "admin123", role: "admin", department: "Administration", phone: "880-1-234567", bio: "Academic Director", joinDate: "2020-01-15", profile_picture: "HA" },
  { id: 11, name: "Fatima Khan", email: "registrar@university.edu", password: "admin123", role: "admin", department: "Registration", phone: "880-1-234568", bio: "Registrar", joinDate: "2019-06-20", profile_picture: "FK" },

  // Teachers
  { id: 2, name: "Dr. Muhammad Rahman", email: "rahman@university.edu", password: "teacher123", role: "teacher", department: "Computer Science", phone: "880-1-234569", bio: "Database Expert", joinDate: "2018-02-10", profile_picture: "MR", specialization: "Database Systems", office: "CS-101" },
  { id: 3, name: "Dr. Karim Ahmed", email: "karim@university.edu", password: "teacher123", role: "teacher", department: "Computer Science", phone: "880-1-234570", bio: "Software Engineering Lead", joinDate: "2017-08-05", profile_picture: "KA", specialization: "Software Engineering", office: "CS-102" },
  { id: 12, name: "Prof. Saiful Islam", email: "saiful@university.edu", password: "teacher123", role: "teacher", department: "Computer Science", phone: "880-1-234571", bio: "Web Development Expert", joinDate: "2019-01-15", profile_picture: "SI", specialization: "Web Development", office: "CS-103" },
  { id: 13, name: "Dr. Nasrin Begum", email: "nasrin@university.edu", password: "teacher123", role: "teacher", department: "Computer Science", phone: "880-1-234572", bio: "AI & ML Specialist", joinDate: "2020-03-20", profile_picture: "NB", specialization: "Machine Learning", office: "CS-104" },

  // Students
  { id: 4, name: "Tahanur Islam", email: "tahanur@university.edu", password: "student123", role: "student", department: "Computer Science", phone: "880-1-234573", bio: "3rd Year Student", joinDate: "2023-09-01", profile_picture: "TI", semester: 5, gpa: 3.75 },
  { id: 5, name: "Sadia Akter", email: "sadia@university.edu", password: "student123", role: "student", department: "Computer Science", phone: "880-1-234574", bio: "3rd Year Student", joinDate: "2023-09-01", profile_picture: "SA", semester: 5, gpa: 3.82 },
  { id: 6, name: "Rafiq Hossain", email: "rafiq@university.edu", password: "student123", role: "student", department: "Computer Science", phone: "880-1-234575", bio: "2nd Year Student", joinDate: "2024-09-01", profile_picture: "RH", semester: 3, gpa: 3.45 },
  { id: 14, name: "Aisha Khan", email: "aisha@university.edu", password: "student123", role: "student", department: "Computer Science", phone: "880-1-234576", bio: "2nd Year Student", joinDate: "2024-09-01", profile_picture: "AK", semester: 4, gpa: 3.68 },
  { id: 15, name: "Habib Ahmed", email: "habib@university.edu", password: "student123", role: "student", department: "Computer Science", phone: "880-1-234577", bio: "1st Year Student", joinDate: "2025-09-01", profile_picture: "HA", semester: 1, gpa: 3.50 },
  { id: 16, name: "Maria Iqbal", email: "maria@university.edu", password: "student123", role: "student", department: "Computer Science", phone: "880-1-234578", bio: "3rd Year Student", joinDate: "2023-09-01", profile_picture: "MI", semester: 6, gpa: 3.90 },
];

export const mockRooms = [
  // Main Building Classrooms
  { id: 1, room_number: "A-101", capacity: 40, building: "Main Block", floor: 1, features: ["Projector", "AC"], is_active: true, department: "Computer Science" },
  { id: 2, room_number: "A-102", capacity: 35, building: "Main Block", floor: 1, features: ["Projector", "AC", "Whiteboard"], is_active: true, department: "Computer Science" },
  { id: 3, room_number: "B-202", capacity: 50, building: "Main Block", floor: 2, features: ["Projector", "AC", "Whiteboard", "Speakers"], is_active: true, department: "Computer Science" },
  { id: 4, room_number: "B-203", capacity: 45, building: "Main Block", floor: 2, features: ["Projector", "AC"], is_active: true, department: "Computer Science" },

  // Science Wing
  { id: 5, room_number: "C-105", capacity: 60, building: "Science Wing", floor: 1, features: ["Projector", "AC", "Smart Board"], is_active: true, department: "Computer Science" },
  { id: 6, room_number: "C-106", capacity: 55, building: "Science Wing", floor: 1, features: ["Projector", "AC"], is_active: true, department: "Computer Science" },

  // Lab Building
  { id: 7, room_number: "Lab-101", capacity: 30, building: "Lab Building", floor: 1, features: ["Computers", "AC", "Network"], is_active: true, department: "Computer Science" },
  { id: 8, room_number: "Lab-102", capacity: 25, building: "Lab Building", floor: 1, features: ["Computers", "AC"], is_active: true, department: "Computer Science" },
  { id: 9, room_number: "Lab-201", capacity: 28, building: "Lab Building", floor: 2, features: ["Computers", "AC", "Network"], is_active: false, department: "Computer Science" },

  // Seminar Halls
  { id: 10, room_number: "SH-01", capacity: 80, building: "Seminar Hall", floor: 1, features: ["Projector", "AC", "Stage", "Sound System"], is_active: true, department: "Computer Science" },
];

export const mockCourses = [
  // Level 100 Courses
  { id: 1, course_name: "Introduction to Programming", course_code: "CSE-101", teacher_id: 2, teacher_name: "Dr. Muhammad Rahman", credit_hours: 3, department: "Computer Science", level: 100, prerequisite: "None", description: "Basics of programming with Python", capacity: 60, enrolled: 58 },
  { id: 2, course_name: "Discrete Mathematics", course_code: "CSE-102", teacher_id: 3, teacher_name: "Dr. Karim Ahmed", credit_hours: 3, department: "Computer Science", level: 100, prerequisite: "None", description: "Mathematical foundations for CS", capacity: 50, enrolled: 48 },
  { id: 3, course_name: "Digital Logic Design", course_code: "CSE-103", teacher_id: 12, teacher_name: "Prof. Saiful Islam", credit_hours: 3, department: "Computer Science", level: 100, prerequisite: "None", description: "Logic gates and circuits", capacity: 45, enrolled: 43 },

  // Level 200 Courses
  { id: 4, course_name: "Data Structures", course_code: "CSE-201", teacher_id: 2, teacher_name: "Dr. Muhammad Rahman", credit_hours: 3, department: "Computer Science", level: 200, prerequisite: "CSE-101", description: "Arrays, linked lists, trees, graphs", capacity: 50, enrolled: 48 },
  { id: 5, course_name: "Object-Oriented Programming", course_code: "CSE-202", teacher_id: 3, teacher_name: "Dr. Karim Ahmed", credit_hours: 3, department: "Computer Science", level: 200, prerequisite: "CSE-101", description: "OOP concepts in Java", capacity: 55, enrolled: 52 },
  { id: 6, course_name: "Database Systems", course_code: "CSE-203", teacher_id: 2, teacher_name: "Dr. Muhammad Rahman", credit_hours: 3, department: "Computer Science", level: 200, prerequisite: "CSE-201", description: "DBMS and SQL", capacity: 45, enrolled: 44 },

  // Level 300 Courses
  { id: 7, course_name: "Web Development", course_code: "CSE-301", teacher_id: 12, teacher_name: "Prof. Saiful Islam", credit_hours: 3, department: "Computer Science", level: 300, prerequisite: "CSE-202", description: "HTML, CSS, JavaScript", capacity: 50, enrolled: 47 },
  { id: 8, course_name: "Software Engineering", course_code: "CSE-302", teacher_id: 3, teacher_name: "Dr. Karim Ahmed", credit_hours: 3, department: "Computer Science", level: 300, prerequisite: "CSE-202", description: "SDLC and project management", capacity: 40, enrolled: 38 },
  { id: 9, course_name: "Artificial Intelligence", course_code: "CSE-303", teacher_id: 13, teacher_name: "Dr. Nasrin Begum", credit_hours: 3, department: "Computer Science", level: 300, prerequisite: "CSE-201", description: "AI fundamentals and algorithms", capacity: 45, enrolled: 42 },

  // Level 400 Courses
  { id: 10, course_name: "Machine Learning", course_code: "CSE-401", teacher_id: 13, teacher_name: "Dr. Nasrin Begum", credit_hours: 3, department: "Computer Science", level: 400, prerequisite: "CSE-303", description: "ML algorithms and models", capacity: 35, enrolled: 33 },
  { id: 11, course_name: "Capstone Project", course_code: "CSE-499", teacher_id: 2, teacher_name: "Dr. Muhammad Rahman", credit_hours: 6, department: "Computer Science", level: 400, prerequisite: "CSE-302", description: "Final year project", capacity: 30, enrolled: 28 },

  // Lab Courses
  { id: 12, course_name: "Data Structures Lab", course_code: "CSE-201L", teacher_id: 2, teacher_name: "Dr. Muhammad Rahman", credit_hours: 1.5, department: "Computer Science", level: 200, prerequisite: "CSE-201", description: "Practical DS implementation", capacity: 30, enrolled: 28 },
  { id: 13, course_name: "Database Lab", course_code: "CSE-203L", teacher_id: 2, teacher_name: "Dr. Muhammad Rahman", credit_hours: 1.5, department: "Computer Science", level: 200, prerequisite: "CSE-203", description: "SQL practice", capacity: 25, enrolled: 24 },
  { id: 14, course_name: "Web Development Lab", course_code: "CSE-301L", teacher_id: 12, teacher_name: "Prof. Saiful Islam", credit_hours: 1.5, department: "Computer Science", level: 300, prerequisite: "CSE-301", description: "Building web projects", capacity: 30, enrolled: 29 },
];


export const mockTimeslots = [
  { id: 1, day_of_week: "Sunday",    start_time: "08:00:00", end_time: "09:30:00" },
  { id: 2, day_of_week: "Sunday",    start_time: "09:30:00", end_time: "11:00:00" },
  { id: 3, day_of_week: "Sunday",    start_time: "11:00:00", end_time: "12:30:00" },
  { id: 4, day_of_week: "Sunday",    start_time: "13:00:00", end_time: "14:30:00" },
  { id: 5, day_of_week: "Sunday",    start_time: "14:30:00", end_time: "16:00:00" },
  { id: 6, day_of_week: "Monday",    start_time: "08:00:00", end_time: "09:30:00" },
  { id: 7, day_of_week: "Monday",    start_time: "09:30:00", end_time: "11:00:00" },
  { id: 8, day_of_week: "Monday",    start_time: "11:00:00", end_time: "12:30:00" },
  { id: 9, day_of_week: "Monday",    start_time: "13:00:00", end_time: "14:30:00" },
  { id: 10, day_of_week: "Monday",   start_time: "14:30:00", end_time: "16:00:00" },
  { id: 11, day_of_week: "Tuesday",  start_time: "08:00:00", end_time: "09:30:00" },
  { id: 12, day_of_week: "Tuesday",  start_time: "09:30:00", end_time: "11:00:00" },
  { id: 13, day_of_week: "Tuesday",  start_time: "11:00:00", end_time: "12:30:00" },
  { id: 14, day_of_week: "Tuesday",  start_time: "13:00:00", end_time: "14:30:00" },
  { id: 15, day_of_week: "Tuesday",  start_time: "14:30:00", end_time: "16:00:00" },
  { id: 16, day_of_week: "Wednesday",start_time: "08:00:00", end_time: "09:30:00" },
  { id: 17, day_of_week: "Wednesday",start_time: "09:30:00", end_time: "11:00:00" },
  { id: 18, day_of_week: "Wednesday",start_time: "11:00:00", end_time: "12:30:00" },
  { id: 19, day_of_week: "Thursday", start_time: "08:00:00", end_time: "09:30:00" },
  { id: 20, day_of_week: "Thursday", start_time: "09:30:00", end_time: "11:00:00" },
  { id: 21, day_of_week: "Thursday", start_time: "11:00:00", end_time: "12:30:00" },
  { id: 22, day_of_week: "Thursday", start_time: "13:00:00", end_time: "14:30:00" },
  { id: 23, day_of_week: "Thursday", start_time: "14:30:00", end_time: "16:00:00" },
  { id: 24, day_of_week: "Friday",   start_time: "08:00:00", end_time: "09:30:00" },
  { id: 25, day_of_week: "Friday",   start_time: "09:30:00", end_time: "11:00:00" },
];

export const mockSchedules = [
  // Semester: Spring 2025 - CSE-101
  { id: 1, course_id: 1, room_id: 1, time_slot_id: 1, semester: "Spring2025", status: "active", course_name: "Introduction to Programming", course_code: "CSE-101", teacher_name: "Dr. Muhammad Rahman", room_number: "A-101", day: "Sunday", start_time: "08:00", end_time: "09:30", enrolled: 58 },
  { id: 2, course_id: 1, room_id: 1, time_slot_id: 7, semester: "Spring2025", status: "active", course_name: "Introduction to Programming", course_code: "CSE-101", teacher_name: "Dr. Muhammad Rahman", room_number: "A-101", day: "Monday", start_time: "09:30", end_time: "11:00", enrolled: 58 },

  // CSE-102
  { id: 3, course_id: 2, room_id: 3, time_slot_id: 2, semester: "Spring2025", status: "active", course_name: "Discrete Mathematics", course_code: "CSE-102", teacher_name: "Dr. Karim Ahmed", room_number: "B-202", day: "Sunday", start_time: "09:30", end_time: "11:00", enrolled: 48 },
  { id: 4, course_id: 2, room_id: 3, time_slot_id: 8, semester: "Spring2025", status: "active", course_name: "Discrete Mathematics", course_code: "CSE-102", teacher_name: "Dr. Karim Ahmed", room_number: "B-202", day: "Monday", start_time: "11:00", end_time: "12:30", enrolled: 48 },

  // CSE-201
  { id: 5, course_id: 4, room_id: 2, time_slot_id: 11, semester: "Spring2025", status: "active", course_name: "Data Structures", course_code: "CSE-201", teacher_name: "Dr. Muhammad Rahman", room_number: "A-102", day: "Tuesday", start_time: "08:00", end_time: "09:30", enrolled: 48 },
  { id: 6, course_id: 4, room_id: 2, time_slot_id: 17, semester: "Spring2025", status: "active", course_name: "Data Structures", course_code: "CSE-201", teacher_name: "Dr. Muhammad Rahman", room_number: "A-102", day: "Wednesday", start_time: "09:30", end_time: "11:00", enrolled: 48 },

  // CSE-202
  { id: 7, course_id: 5, room_id: 5, time_slot_id: 12, semester: "Spring2025", status: "active", course_name: "Object-Oriented Programming", course_code: "CSE-202", teacher_name: "Dr. Karim Ahmed", room_number: "C-105", day: "Tuesday", start_time: "09:30", end_time: "11:00", enrolled: 52 },
  { id: 8, course_id: 5, room_id: 5, time_slot_id: 20, semester: "Spring2025", status: "active", course_name: "Object-Oriented Programming", course_code: "CSE-202", teacher_name: "Dr. Karim Ahmed", room_number: "C-105", day: "Thursday", start_time: "09:30", end_time: "11:00", enrolled: 52 },

  // CSE-203
  { id: 9, course_id: 6, room_id: 4, time_slot_id: 13, semester: "Spring2025", status: "active", course_name: "Database Systems", course_code: "CSE-203", teacher_name: "Dr. Muhammad Rahman", room_number: "B-203", day: "Tuesday", start_time: "11:00", end_time: "12:30", enrolled: 44 },
  { id: 10, course_id: 6, room_id: 4, time_slot_id: 21, semester: "Spring2025", status: "active", course_name: "Database Systems", course_code: "CSE-203", teacher_name: "Dr. Muhammad Rahman", room_number: "B-203", day: "Thursday", start_time: "11:00", end_time: "12:30", enrolled: 44 },

  // CSE-301
  { id: 11, course_id: 7, room_id: 5, time_slot_id: 4, semester: "Spring2025", status: "active", course_name: "Web Development", course_code: "CSE-301", teacher_name: "Prof. Saiful Islam", room_number: "C-105", day: "Sunday", start_time: "13:00", end_time: "14:30", enrolled: 47 },
  { id: 12, course_id: 7, room_id: 5, time_slot_id: 10, semester: "Spring2025", status: "active", course_name: "Web Development", course_code: "CSE-301", teacher_name: "Prof. Saiful Islam", room_number: "C-105", day: "Monday", start_time: "14:30", end_time: "16:00", enrolled: 47 },

  // CSE-302
  { id: 13, course_id: 8, room_id: 6, time_slot_id: 5, semester: "Spring2025", status: "active", course_name: "Software Engineering", course_code: "CSE-302", teacher_name: "Dr. Karim Ahmed", room_number: "C-106", day: "Sunday", start_time: "14:30", end_time: "16:00", enrolled: 38 },
  { id: 14, course_id: 8, room_id: 6, time_slot_id: 14, semester: "Spring2025", status: "active", course_name: "Software Engineering", course_code: "CSE-302", teacher_name: "Dr. Karim Ahmed", room_number: "C-106", day: "Tuesday", start_time: "13:00", end_time: "14:30", enrolled: 38 },

  // CSE-303
  { id: 15, course_id: 9, room_id: 3, time_slot_id: 16, semester: "Spring2025", status: "active", course_name: "Artificial Intelligence", course_code: "CSE-303", teacher_name: "Dr. Nasrin Begum", room_number: "B-202", day: "Wednesday", start_time: "08:00", end_time: "09:30", enrolled: 42 },
  { id: 16, course_id: 9, room_id: 3, time_slot_id: 19, semester: "Spring2025", status: "active", course_name: "Artificial Intelligence", course_code: "CSE-303", teacher_name: "Dr. Nasrin Begum", room_number: "B-202", day: "Thursday", start_time: "08:00", end_time: "09:30", enrolled: 42 },

  // Lab Courses
  { id: 17, course_id: 12, room_id: 7, time_slot_id: 5, semester: "Spring2025", status: "active", course_name: "Data Structures Lab", course_code: "CSE-201L", teacher_name: "Dr. Muhammad Rahman", room_number: "Lab-101", day: "Sunday", start_time: "14:30", end_time: "16:00", enrolled: 28 },
  { id: 18, course_id: 13, room_id: 7, time_slot_id: 15, semester: "Spring2025", status: "active", course_name: "Database Lab", course_code: "CSE-203L", teacher_name: "Dr. Muhammad Rahman", room_number: "Lab-101", day: "Tuesday", start_time: "14:30", end_time: "16:00", enrolled: 24 },
  { id: 19, course_id: 14, room_id: 8, time_slot_id: 23, semester: "Spring2025", status: "active", course_name: "Web Development Lab", course_code: "CSE-301L", teacher_name: "Prof. Saiful Islam", room_number: "Lab-102", day: "Thursday", start_time: "14:30", end_time: "16:00", enrolled: 29 },
];

// ────────────────────────────────────────────────────────────────────────────
// 📚 STUDENT ENROLLMENTS
// ────────────────────────────────────────────────────────────────────────────
export const mockEnrollments = [
  // Student 4 (Tahanur Islam) - 5th semester
  { id: 1, student_id: 4, course_id: 4, enrolled_date: "2025-01-10", status: "enrolled", grade: "A", gpa: 4.0 },
  { id: 2, student_id: 4, course_id: 5, enrolled_date: "2025-01-10", status: "enrolled", grade: "A-", gpa: 3.7 },
  { id: 3, student_id: 4, course_id: 6, enrolled_date: "2025-01-10", status: "enrolled", grade: null, gpa: null },
  { id: 4, student_id: 4, course_id: 7, enrolled_date: "2025-01-10", status: "enrolled", grade: null, gpa: null },
  { id: 5, student_id: 4, course_id: 12, enrolled_date: "2025-01-10", status: "enrolled", grade: null, gpa: null },

  // Student 5 (Sadia Akter) - 5th semester
  { id: 6, student_id: 5, course_id: 4, enrolled_date: "2025-01-10", status: "enrolled", grade: "A", gpa: 4.0 },
  { id: 7, student_id: 5, course_id: 5, enrolled_date: "2025-01-10", status: "enrolled", grade: "A", gpa: 4.0 },
  { id: 8, student_id: 5, course_id: 8, enrolled_date: "2025-01-10", status: "enrolled", grade: null, gpa: null },
  { id: 9, student_id: 5, course_id: 9, enrolled_date: "2025-01-10", status: "enrolled", grade: null, gpa: null },

  // Student 6 (Rafiq Hossain) - 3rd semester
  { id: 10, student_id: 6, course_id: 1, enrolled_date: "2025-01-10", status: "enrolled", grade: "B+", gpa: 3.3 },
  { id: 11, student_id: 6, course_id: 2, enrolled_date: "2025-01-10", status: "enrolled", grade: null, gpa: null },
  { id: 12, student_id: 6, course_id: 3, enrolled_date: "2025-01-10", status: "enrolled", grade: null, gpa: null },

  // Student 14 (Aisha Khan)
  { id: 13, student_id: 14, course_id: 1, enrolled_date: "2025-01-10", status: "enrolled", grade: "A-", gpa: 3.7 },
  { id: 14, student_id: 14, course_id: 2, enrolled_date: "2025-01-10", status: "enrolled", grade: "A", gpa: 4.0 },
  { id: 15, student_id: 14, course_id: 4, enrolled_date: "2025-01-10", status: "enrolled", grade: null, gpa: null },

  // Student 16 (Maria Iqbal)
  { id: 16, student_id: 16, course_id: 4, enrolled_date: "2025-01-10", status: "enrolled", grade: "A", gpa: 4.0 },
  { id: 17, student_id: 16, course_id: 5, enrolled_date: "2025-01-10", status: "enrolled", grade: "A", gpa: 4.0 },
  { id: 18, student_id: 16, course_id: 7, enrolled_date: "2025-01-10", status: "enrolled", grade: "A-", gpa: 3.7 },
];

// ────────────────────────────────────────────────────────────────────────────
// ⚠️ SCHEDULING CONFLICTS
// ────────────────────────────────────────────────────────────────────────────
export const mockConflicts = [
  {
    id: 1,
    type: "room_overlap",
    severity: "high",
    semester: "Spring2025",
    resolved: false,
    courses: [
      { id: 1, code: "CSE-101", name: "Introduction to Programming", teacher: "Dr. Muhammad Rahman" },
      { id: 4, code: "CSE-201", name: "Data Structures", teacher: "Dr. Muhammad Rahman" }
    ],
    room: "A-101",
    time: "Monday 08:00 - 09:30",
    description: "Two courses assigned to same room at overlapping times",
    suggestion: "Reschedule CSE-201 to different time slot",
    resolution_attempts: 2,
  },
  {
    id: 2,
    type: "instructor_overlap",
    severity: "high",
    semester: "Spring2025",
    resolved: false,
    instructors: ["Dr. Karim Ahmed", "Dr. Karim Ahmed"],
    courses: [
      { id: 5, code: "CSE-202", name: "Object-Oriented Programming", teacher: "Dr. Karim Ahmed" },
      { id: 8, code: "CSE-302", name: "Software Engineering", teacher: "Dr. Karim Ahmed" }
    ],
    time: "Tuesday 09:30 - 11:00",
    description: "Instructor assigned to two courses at same time",
    suggestion: "Assign different instructor to one course",
    resolution_attempts: 1,
  },
  {
    id: 3,
    type: "capacity_exceeded",
    severity: "medium",
    semester: "Spring2025",
    resolved: true,
    courses: [
      { id: 1, code: "CSE-101", name: "Introduction to Programming", teacher: "Dr. Muhammad Rahman" }
    ],
    room: "A-101",
    room_capacity: 40,
    enrolled_students: 58,
    description: "More students enrolled than room capacity",
    suggestion: "Move course to larger classroom",
    resolution: "Moved to room C-105 (capacity 60)",
    resolution_date: "2025-01-08",
  },
  {
    id: 4,
    type: "time_overlap",
    severity: "low",
    semester: "Spring2025",
    resolved: false,
    courses: [
      { id: 7, code: "CSE-301", name: "Web Development", teacher: "Prof. Saiful Islam" },
      { id: 12, code: "CSE-201L", name: "Data Structures Lab", teacher: "Dr. Muhammad Rahman" }
    ],
    time: "Sunday 14:30 - 16:00",
    description: "Students may have back-to-back classes",
    suggestion: "Schedule with 30-min break between classes",
    resolution_attempts: 0,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// 📊 ADMIN DASHBOARD STATISTICS
// ────────────────────────────────────────────────────────────────────────────
export const mockAdminStats = {
  total_users: 16,
  total_admins: 2,
  total_teachers: 4,
  total_students: 10,
  total_courses: 14,
  total_rooms: 10,
  total_schedules: 19,
  active_schedules: 19,
  total_conflicts: 4,
  resolved_conflicts: 1,
  unresolved_conflicts: 3,
  average_class_size: 45.2,
  room_utilization: 87.5,
  schedule_efficiency: 92.3,
};

export const mockAdminCharts = {
  user_distribution: [
    { name: "Admin", value: 2, color: "#ff6b6b" },
    { name: "Teachers", value: 4, color: "#4ecdc4" },
    { name: "Students", value: 10, color: "#45b7d1" },
  ],
  course_distribution: [
    { name: "Level 100", value: 3 },
    { name: "Level 200", value: 4 },
    { name: "Level 300", value: 3 },
    { name: "Level 400", value: 2 },
    { name: "Labs", value: 3 },
  ],
  enrollment_trends: [
    { month: "Sep", enrollments: 120 },
    { month: "Oct", enrollments: 145 },
    { month: "Nov", enrollments: 168 },
    { month: "Dec", enrollments: 182 },
    { month: "Jan", enrollments: 195 },
  ],
  room_utilization_hourly: [
    { hour: "08:00", utilization: 85 },
    { hour: "09:30", utilization: 92 },
    { hour: "11:00", utilization: 78 },
    { hour: "13:00", utilization: 65 },
    { hour: "14:30", utilization: 88 },
  ],
};

export const mockAdminActivities = [
  { id: 1, type: "user_created", description: "New user created: Maria Iqbal (Student)", timestamp: "2025-01-20 10:30", actor: "Dr. Hassan Ahmed" },
  { id: 2, type: "course_created", description: "New course created: Machine Learning (CSE-401)", timestamp: "2025-01-20 09:15", actor: "Dr. Hassan Ahmed" },
  { id: 3, type: "schedule_generated", description: "Spring 2025 schedule generated for 14 courses", timestamp: "2025-01-19 14:20", actor: "Fatima Khan" },
  { id: 4, type: "conflict_resolved", description: "Conflict resolved: Room capacity issue in CSE-101", timestamp: "2025-01-18 16:45", actor: "Dr. Hassan Ahmed" },
  { id: 5, type: "room_added", description: "New room added: SH-01 (Seminar Hall, Capacity 80)", timestamp: "2025-01-17 11:10", actor: "Fatima Khan" },
  { id: 6, type: "user_edited", description: "User profile updated: Dr. Nasrin Begum", timestamp: "2025-01-16 13:25", actor: "Dr. Hassan Ahmed" },
];

// ────────────────────────────────────────────────────────────────────────────
// 👨‍🏫 TEACHER DASHBOARD STATISTICS
// ────────────────────────────────────────────────────────────────────────────
export const mockTeacherStats = (teacherId) => {
  const teacherData = {
    2: { // Dr. Muhammad Rahman
      total_courses: 4,
      students_taught: 162,
      scheduled_classes: 6,
      upcoming_class: "CSE-101 - Monday 09:30 (A-101)",
      avg_class_attendance: 94.2,
      active_semesters: ["Spring2025"],
    },
    3: { // Dr. Karim Ahmed
      total_courses: 3,
      students_taught: 138,
      scheduled_classes: 5,
      upcoming_class: "CSE-202 - Tuesday 09:30 (C-105)",
      avg_class_attendance: 91.5,
      active_semesters: ["Spring2025"],
    },
    12: { // Prof. Saiful Islam
      total_courses: 2,
      students_taught: 76,
      scheduled_classes: 4,
      upcoming_class: "CSE-301 - Sunday 13:00 (C-105)",
      avg_class_attendance: 93.8,
      active_semesters: ["Spring2025"],
    },
    13: { // Dr. Nasrin Begum
      total_courses: 2,
      students_taught: 84,
      scheduled_classes: 3,
      upcoming_class: "CSE-303 - Wednesday 08:00 (B-202)",
      avg_class_attendance: 95.1,
      active_semesters: ["Spring2025"],
    },
  };
  return teacherData[teacherId] || teacherData[2];
};

export const mockTeacherCharts = {
  enrollment_by_course: [
    { course: "CSE-101", students: 58 },
    { course: "CSE-201", students: 48 },
    { course: "CSE-201L", students: 28 },
    { course: "CSE-203", students: 44 },
  ],
  attendance_trend: [
    { week: "Week 1", attendance: 92 },
    { week: "Week 2", attendance: 94 },
    { week: "Week 3", attendance: 93 },
    { week: "Week 4", attendance: 95 },
    { week: "Week 5", attendance: 97 },
  ],
};

export const mockTeacherActivities = [
  { id: 1, type: "attendance_marked", description: "Attendance marked for CSE-101", timestamp: "2025-01-20 10:00", course: "CSE-101" },
  { id: 2, type: "grade_submitted", description: "Grades submitted for CSE-201 midterm", timestamp: "2025-01-19 15:30", course: "CSE-201" },
  { id: 3, type: "class_schedule", description: "Class scheduled: CSE-301 Lab", timestamp: "2025-01-18 09:00", course: "CSE-301L" },
  { id: 4, type: "assignment_posted", description: "New assignment posted", timestamp: "2025-01-17 14:20", course: "CSE-202" },
];

// ────────────────────────────────────────────────────────────────────────────
// 📚 STUDENT DASHBOARD STATISTICS
// ────────────────────────────────────────────────────────────────────────────
export const mockStudentStats = (studentId) => {
  const studentData = {
    4: { // Tahanur Islam
      total_courses: 5,
      completed_courses: 12,
      total_credits: 13.5,
      current_gpa: 3.75,
      semester: 5,
      attendance_rate: 94.3,
      cumulative_gpa: 3.72,
    },
    5: { // Sadia Akter
      total_courses: 4,
      completed_courses: 12,
      total_credits: 12.0,
      current_gpa: 3.82,
      semester: 5,
      attendance_rate: 96.8,
      cumulative_gpa: 3.78,
    },
    6: { // Rafiq Hossain
      total_courses: 3,
      completed_courses: 8,
      total_credits: 9.0,
      current_gpa: 3.45,
      semester: 3,
      attendance_rate: 89.5,
      cumulative_gpa: 3.48,
    },
  };
  return studentData[studentId] || studentData[4];
};

export const mockStudentCharts = {
  gpa_trend: [
    { semester: "1st", gpa: 3.65 },
    { semester: "2nd", gpa: 3.70 },
    { semester: "3rd", gpa: 3.72 },
    { semester: "4th", gpa: 3.73 },
    { semester: "5th", gpa: 3.75 },
  ],
  course_performance: [
    { course: "CSE-201", grade: "A", score: 95 },
    { course: "CSE-202", grade: "A-", score: 90 },
    { course: "CSE-203", grade: "A", score: 93 },
    { course: "CSE-301", grade: "B+", score: 87 },
  ],
  credit_progress: [
    { semester: "1st", credits: 12 },
    { semester: "2nd", credits: 13 },
    { semester: "3rd", credits: 12 },
    { semester: "4th", credits: 14 },
    { semester: "5th", credits: 13.5 },
  ],
};

export const mockStudentActivities = [
  { id: 1, type: "assignment_submitted", description: "Assignment submitted for CSE-201", timestamp: "2025-01-20 23:45", course: "CSE-201" },
  { id: 2, type: "grade_received", description: "Midterm grades released", timestamp: "2025-01-19 10:00", course: "CSE-202" },
  { id: 3, type: "course_registered", description: "Registered for CSE-301", timestamp: "2025-01-18 14:20", course: "CSE-301" },
  { id: 4, type: "exam_scheduled", description: "Final exam scheduled", timestamp: "2025-01-17 09:30", course: "CSE-203" },
  { id: 5, type: "attendance_marked", description: "Attendance marked present", timestamp: "2025-01-16 08:05", course: "CSE-201" },
];

// ────────────────────────────────────────────────────────────────────────────
// 📝 ATTENDANCE RECORDS
// ────────────────────────────────────────────────────────────────────────────
export const mockAttendance = [
  // Week 1
  { id: 1, schedule_id: 1, student_id: 4, status: "present", date: "2025-01-12", time_in: "08:02", time_out: "09:28" },
  { id: 2, schedule_id: 1, student_id: 5, status: "present", date: "2025-01-12", time_in: "08:00", time_out: "09:30" },
  { id: 3, schedule_id: 1, student_id: 6, status: "absent", date: "2025-01-12" },
  // Week 2
  { id: 4, schedule_id: 1, student_id: 4, status: "present", date: "2025-01-19", time_in: "08:01", time_out: "09:29" },
  { id: 5, schedule_id: 1, student_id: 5, status: "present", date: "2025-01-19", time_in: "08:03", time_out: "09:30" },
  { id: 6, schedule_id: 1, student_id: 6, status: "present", date: "2025-01-19", time_in: "08:05", time_out: "09:27" },
];

// ────────────────────────────────────────────────────────────────────────────
// 📋 GRADES
// ────────────────────────────────────────────────────────────────────────────
export const mockGrades = [
  // CSE-201 - Data Structures
  { id: 1, student_id: 4, course_id: 4, assignment1: 85, assignment2: 88, midterm: 92, final: 94, gpa: 4.0, grade: "A" },
  { id: 2, student_id: 5, course_id: 4, assignment1: 90, assignment2: 92, midterm: 95, final: 96, gpa: 4.0, grade: "A" },
  { id: 3, student_id: 6, course_id: 4, assignment1: 75, assignment2: 78, midterm: 82, final: 85, gpa: 3.3, grade: "B+" },

  // CSE-202 - OOP
  { id: 4, student_id: 4, course_id: 5, assignment1: 82, assignment2: 85, midterm: 88, final: 91, gpa: 3.7, grade: "A-" },
  { id: 5, student_id: 5, course_id: 5, assignment1: 88, assignment2: 90, midterm: 93, final: 95, gpa: 4.0, grade: "A" },
  { id: 6, student_id: 14, course_id: 5, assignment1: 90, assignment2: 91, midterm: 94, final: 96, gpa: 4.0, grade: "A" },
];

// ────────────────────────────────────────────────────────────────────────────
// 📅 NOTIFICATIONS & ANNOUNCEMENTS
// ────────────────────────────────────────────────────────────────────────────
export const mockNotifications = [
  { id: 1, type: "assignment", title: "New Assignment Posted", message: "CSE-201: Data Structures Assignment #5 posted", timestamp: "2025-01-20 10:30", read: false, priority: "high" },
  { id: 2, type: "grade", title: "Grade Released", message: "Your midterm grade for CSE-202 is available", timestamp: "2025-01-19 14:20", read: false, priority: "medium" },
  { id: 3, type: "class", title: "Class Reminder", message: "Reminder: CSE-301 class starts in 30 minutes", timestamp: "2025-01-18 12:30", read: true, priority: "low" },
  { id: 4, type: "system", title: "Schedule Updated", message: "Spring 2025 schedule has been finalized", timestamp: "2025-01-17 09:00", read: true, priority: "medium" },
  { id: 5, type: "exam", title: "Exam Schedule Released", message: "Final exams schedule is now available", timestamp: "2025-01-16 15:45", read: true, priority: "high" },
];

export const mockAnnouncements = [
  {
    id: 1,
    title: "Spring Semester 2025 Begins",
    content: "Welcome to Spring Semester 2025! Classes start on Sunday, January 12, 2025. All students are required to attend orientation on Saturday, January 11.",
    author: "Dr. Hassan Ahmed",
    timestamp: "2025-01-10",
    category: "general",
    priority: "high",
  },
  {
    id: 2,
    title: "Midterm Exam Schedule Released",
    content: "Midterm examinations for all courses will be held from January 26 to February 2, 2025. See attached schedule for details.",
    author: "Fatima Khan",
    timestamp: "2025-01-15",
    category: "academic",
    priority: "high",
  },
  {
    id: 3,
    title: "Lab Equipment Maintenance",
    content: "Lab-201 will be closed for equipment maintenance on January 25-26. All lab sessions scheduled during this period have been rescheduled.",
    author: "Dr. Hassan Ahmed",
    timestamp: "2025-01-18",
    category: "facility",
    priority: "medium",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// 📞 OFFICE HOURS & MEETINGS
// ────────────────────────────────────────────────────────────────────────────
export const mockOfficeHours = [
  { id: 1, teacher_id: 2, teacher_name: "Dr. Muhammad Rahman", day: "Monday", start_time: "14:00", end_time: "16:00", location: "CS-101", max_students: 3 },
  { id: 2, teacher_id: 2, teacher_name: "Dr. Muhammad Rahman", day: "Wednesday", start_time: "16:00", end_time: "17:30", location: "CS-101", max_students: 3 },
  { id: 3, teacher_id: 3, teacher_name: "Dr. Karim Ahmed", day: "Tuesday", start_time: "15:00", end_time: "17:00", location: "CS-102", max_students: 4 },
  { id: 4, teacher_id: 12, teacher_name: "Prof. Saiful Islam", day: "Thursday", start_time: "14:00", end_time: "16:00", location: "CS-103", max_students: 3 },
  { id: 5, teacher_id: 13, teacher_name: "Dr. Nasrin Begum", day: "Friday", start_time: "13:00", end_time: "15:00", location: "CS-104", max_students: 4 },
];

export const mockMeetings = [
  { id: 1, title: "Academic Planning Meeting", date: "2025-01-22", time: "10:00", location: "Conference Room A", attendees: ["Dr. Hassan Ahmed", "Fatima Khan", "Dr. Muhammad Rahman"], status: "scheduled" },
  { id: 2, title: "Faculty Development Workshop", date: "2025-01-25", time: "14:00", location: "Main Hall", attendees: ["All Faculty"], status: "scheduled" },
  { id: 3, title: "Student Council Meeting", date: "2025-01-23", time: "16:00", location: "Student Center", attendees: ["Student Representatives"], status: "scheduled" },
];

export const mockVacancies = [
  { id: 1, teacher_id: 2, time_slot_id: 3,  semester: "Spring2025", is_available: true  },
  { id: 2, teacher_id: 2, time_slot_id: 8,  semester: "Spring2025", is_available: true  },
  { id: 3, teacher_id: 2, time_slot_id: 1,  semester: "Spring2025", is_available: true  },
  { id: 4, teacher_id: 2, time_slot_id: 5,  semester: "Spring2025", is_available: false },
  { id: 5, teacher_id: 3, time_slot_id: 5,  semester: "Spring2025", is_available: true  },
  { id: 6, teacher_id: 3, time_slot_id: 10, semester: "Spring2025", is_available: true  },
];