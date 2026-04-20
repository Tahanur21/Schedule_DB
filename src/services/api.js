import { mockUsers, mockCourses, mockRooms, mockSchedules, mockConflicts } from "./mockData";

const BASE_URL = "http://127.0.0.1:5000/api";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// ── LOCAL STORAGE FOR OFFLINE CRUD ────────────────────
// Initialize localStorage with mockData on first load
if (!localStorage.getItem("appUsers")) {
  localStorage.setItem("appUsers", JSON.stringify(mockUsers));
  console.log("Initialized appUsers with mockData");
}
if (!localStorage.getItem("appCourses")) {
  localStorage.setItem("appCourses", JSON.stringify(mockCourses));
  console.log("Initialized appCourses with mockData");
}
if (!localStorage.getItem("appRooms")) {
  localStorage.setItem("appRooms", JSON.stringify(mockRooms));
  console.log("Initialized appRooms with mockData");
}

let localUsers = JSON.parse(localStorage.getItem("appUsers")) || [...mockUsers];
let localCourses = JSON.parse(localStorage.getItem("appCourses")) || [...mockCourses];
let localRooms = JSON.parse(localStorage.getItem("appRooms")) || [...mockRooms];

const saveUsers = () => localStorage.setItem("appUsers", JSON.stringify(localUsers));
const saveCourses = () => localStorage.setItem("appCourses", JSON.stringify(localCourses));
const saveRooms = () => localStorage.setItem("appRooms", JSON.stringify(localRooms));

const generateId = () => Math.random().toString(36).substring(7);

// ── AUTH ──────────────────────────────────────────────
export const loginApi = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch {
    return { error: "Cannot connect to server. Is backend running?" };
  }
};

export const registerApi = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch {
    return { error: "Cannot connect to server. Is backend running?" };
  }
};

// ── ADMIN ─────────────────────────────────────────────
export const getUsers = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/users`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    throw new Error("Invalid data format");
  } catch (err) {
    console.log("getUsers fallback:", err.message);
    // Fallback: Return fresh data from localStorage
    return JSON.parse(localStorage.getItem("appUsers")) || [...mockUsers];
  }
};

export const getRooms = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/rooms`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    throw new Error("Invalid data format");
  } catch (err) {
    console.log("getRooms fallback:", err.message);
    // Fallback: Return fresh data from localStorage
    return JSON.parse(localStorage.getItem("appRooms")) || [...mockRooms];
  }
};

export const addRoom = async (token, roomData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/rooms`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(roomData),
    });
    return await res.json();
  } catch {
    // Fallback: Add room to local storage
    const newRoom = {
      id: generateId(),
      ...roomData,
      created_at: new Date().toISOString(),
    };
    localRooms.push(newRoom);
    saveRooms();
    return { id: newRoom.id, room_id: newRoom.id, ...newRoom };
  }
};

export const getCourses = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/courses`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    throw new Error("Invalid data format");
  } catch (err) {
    console.log("getCourses fallback:", err.message);
    // Fallback: Return fresh data from localStorage
    return JSON.parse(localStorage.getItem("appCourses")) || [...mockCourses];
  }
};

export const getTimeslots = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/timeslots`, { headers: getHeaders(token) });
    return await res.json();
  } catch { return []; }
};

export const generateSchedule = async (token, semester) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/generate`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ semester }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log("generateSchedule fallback:", err.message);
    // Fallback: Generate schedule report from mock data
    const schedulesForSemester = mockSchedules.filter(s => s.semester === semester);
    const conflictCount = mockConflicts.filter(c => c.semester === semester && !c.resolved).length;
    
    return {
      semester,
      total_courses: mockCourses.length,
      scheduled: schedulesForSemester.length,
      conflicts: conflictCount,
      schedule_details: schedulesForSemester.map(s => ({
        id: s.id,
        course: s.course_name,
        code: s.course_code,
        teacher: s.teacher_name,
        room: s.room_number,
        day: s.day,
        time: `${s.start_time} - ${s.end_time}`,
        enrolled: s.enrolled,
        status: "scheduled"
      })),
      conflicts_list: mockConflicts.filter(c => c.semester === semester && !c.resolved),
      generated_at: new Date().toISOString(),
      message: "Schedule generated successfully (from mock data)"
    };
  }
};

export const getAdminSchedules = async (token, semester) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/schedules?semester=${semester}`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    throw new Error("Invalid data format");
  } catch (err) {
    console.log("getAdminSchedules fallback:", err.message);
    // Fallback: Return schedules for the given semester
    return mockSchedules.filter(s => s.semester === semester);
  }
};

// ── TEACHER ───────────────────────────────────────────
export const getMyCourses = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/teacher/courses`, { headers: getHeaders(token) });
    return await res.json();
  } catch { return []; }
};

export const submitVacancy = async (token, vacancyData) => {
  try {
    const res = await fetch(`${BASE_URL}/teacher/vacancy`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(vacancyData),
    });
    return await res.json();
  } catch { return { error: "Failed to submit vacancy" }; }
};

export const getMyVacancies = async (token, semester) => {
  try {
    const res = await fetch(`${BASE_URL}/teacher/vacancies?semester=${semester}`, {
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return []; }
};

export const getTeacherSchedule = async (token, semester) => {
  try {
    const res = await fetch(`${BASE_URL}/teacher/schedule?semester=${semester}`, {
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return []; }
};

// ── STUDENT ───────────────────────────────────────────
export const getStudentSchedule = async (token, semester) => {
  try {
    const res = await fetch(`${BASE_URL}/student/schedule?semester=${semester}`, {
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return []; }
};

export const getAvailableCourses = async (token, semester) => {
  try {
    const res = await fetch(`${BASE_URL}/student/courses/available?semester=${semester}`, {
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return []; }
};

export const enrollCourse = async (token, courseId) => {
  try {
    const res = await fetch(`${BASE_URL}/student/courses/enroll`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ course_id: courseId }),
    });
    return await res.json();
  } catch { return { error: "Failed to enroll in course" }; }
};

export const withdrawCourse = async (token, courseId) => {
  try {
    const res = await fetch(`${BASE_URL}/student/courses/withdraw`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ course_id: courseId }),
    });
    return await res.json();
  } catch { return { error: "Failed to withdraw from course" }; }
};

export const getStudentEnrolledCourses = async (token, semester) => {
  try {
    const res = await fetch(`${BASE_URL}/student/courses?semester=${semester}`, {
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return []; }
};

// ── USER PROFILE ──────────────────────────────────────
export const getUserProfile = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return { error: "Failed to fetch profile" }; }
};

export const updateUserProfile = async (token, profileData) => {
  try {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(profileData),
    });
    return await res.json();
  } catch { return { error: "Failed to update profile" }; }
};

export const changePassword = async (token, passwordData) => {
  try {
    const res = await fetch(`${BASE_URL}/users/change-password`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(passwordData),
    });
    return await res.json();
  } catch { return { error: "Failed to change password" }; }
};

// ── ADMIN USER MANAGEMENT ─────────────────────────────
export const addUser = async (token, userData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch {
    // Fallback: Add user to local storage
    const newUser = {
      id: generateId(),
      ...userData,
      created_at: new Date().toISOString(),
    };
    localUsers.push(newUser);
    saveUsers();
    return { id: newUser.id, user_id: newUser.id, ...newUser };
  }
};

export const updateUser = async (token, userId, userData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch {
    // Fallback: Update user in local storage
    const idx = localUsers.findIndex(u => u.id === userId);
    if (idx >= 0) {
      localUsers[idx] = { ...localUsers[idx], ...userData };
      saveUsers();
      return { id: userId, user_id: userId, ...localUsers[idx] };
    }
    return { error: "User not found" };
  }
};

export const deleteUser = async (token, userId) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    return await res.json();
  } catch {
    // Fallback: Delete user from local storage
    const idx = localUsers.findIndex(u => u.id === userId);
    if (idx >= 0) {
      localUsers.splice(idx, 1);
      saveUsers();
      return { success: true, message: "User deleted" };
    }
    return { error: "User not found" };
  }
};

export const bulkImportUsers = async (token, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/admin/users/import`, {
      method: "POST",
      headers: { ...getHeaders(token), "Content-Type": undefined },
      body: formData,
    });
    return await res.json();
  } catch { return { error: "Failed to import users" }; }
};

// ── ADMIN COURSE MANAGEMENT ───────────────────────────
export const addCourse = async (token, courseData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/courses`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(courseData),
    });
    return await res.json();
  } catch {
    // Fallback: Add course to local storage
    const newCourse = {
      id: generateId(),
      ...courseData,
      created_at: new Date().toISOString(),
    };
    localCourses.push(newCourse);
    saveCourses();
    return { id: newCourse.id, course_id: newCourse.id, ...newCourse };
  }
};

export const updateCourse = async (token, courseId, courseData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/courses/${courseId}`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(courseData),
    });
    return await res.json();
  } catch {
    // Fallback: Update course in local storage
    const idx = localCourses.findIndex(c => c.id === courseId);
    if (idx >= 0) {
      localCourses[idx] = { ...localCourses[idx], ...courseData };
      saveCourses();
      return { id: courseId, course_id: courseId, ...localCourses[idx] };
    }
    return { error: "Course not found" };
  }
};

export const deleteCourse = async (token, courseId) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/courses/${courseId}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    return await res.json();
  } catch {
    // Fallback: Delete course from local storage
    const idx = localCourses.findIndex(c => c.id === courseId);
    if (idx >= 0) {
      localCourses.splice(idx, 1);
      saveCourses();
      return { success: true, message: "Course deleted" };
    }
    return { error: "Course not found" };
  }
};

// ── ADMIN ROOM MANAGEMENT ─────────────────────────────
export const updateRoom = async (token, roomId, roomData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/rooms/${roomId}`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(roomData),
    });
    return await res.json();
  } catch {
    // Fallback: Update room in local storage
    const idx = localRooms.findIndex(r => r.id === roomId);
    if (idx >= 0) {
      localRooms[idx] = { ...localRooms[idx], ...roomData };
      saveRooms();
      return { id: roomId, room_id: roomId, ...localRooms[idx] };
    }
    return { error: "Room not found" };
  }
};

export const deleteRoom = async (token, roomId) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/rooms/${roomId}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    return await res.json();
  } catch {
    // Fallback: Delete room from local storage
    const idx = localRooms.findIndex(r => r.id === roomId);
    if (idx >= 0) {
      localRooms.splice(idx, 1);
      saveRooms();
      return { success: true, message: "Room deleted" };
    }
    return { error: "Room not found" };
  }
};

// ── SCHEDULE MANAGEMENT ───────────────────────────────
export const getScheduleDetails = async (token, scheduleId) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/schedules/${scheduleId}`, {
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return { error: "Failed to fetch schedule" }; }
};

export const updateScheduleEntry = async (token, scheduleId, entryData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/schedules/${scheduleId}`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify(entryData),
    });
    return await res.json();
  } catch { return { error: "Failed to update schedule entry" }; }
};

export const deleteScheduleEntry = async (token, scheduleId) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/schedules/${scheduleId}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return { error: "Failed to delete schedule entry" }; }
};

// ── CONFLICT DETECTION ────────────────────────────────
export const getConflicts = async (token, semester) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/conflicts?semester=${semester}`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    throw new Error("Invalid data format");
  } catch (err) {
    console.log("getConflicts fallback:", err.message);
    // Fallback: Return conflicts for the given semester
    return mockConflicts.filter(c => c.semester === semester);
  }
};

export const resolveConflict = async (token, conflictData) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/conflicts/resolve`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(conflictData),
    });
    return await res.json();
  } catch { return { error: "Failed to resolve conflict" }; }
};

// ── SEARCH & FILTER ───────────────────────────────────
export const searchUsers = async (token, query) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/users/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return []; }
};

export const searchCourses = async (token, query) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/courses/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return []; }
};

export const searchRooms = async (token, query) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/rooms/search?q=${encodeURIComponent(query)}`, {
      headers: getHeaders(token),
    });
    return await res.json();
  } catch { return []; }
};