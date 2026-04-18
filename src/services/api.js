const BASE_URL = "http://127.0.0.1:5000/api";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// ── AUTH ──────────────────────────────────────────────
export const loginApi = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const registerApi = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

// ── ADMIN ─────────────────────────────────────────────
export const getUsers = async (token) => {
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: getHeaders(token),
  });
  return res.json();
};

export const getRooms = async (token) => {
  const res = await fetch(`${BASE_URL}/admin/rooms`, {
    headers: getHeaders(token),
  });
  return res.json();
};

export const addRoom = async (token, data) => {
  const res = await fetch(`${BASE_URL}/admin/rooms`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getCourses = async (token) => {
  const res = await fetch(`${BASE_URL}/admin/courses`, {
    headers: getHeaders(token),
  });
  return res.json();
};

export const getTimeslots = async (token) => {
  const res = await fetch(`${BASE_URL}/admin/timeslots`, {
    headers: getHeaders(token),
  });
  return res.json();
};

export const generateSchedule = async (token, semester) => {
  const res = await fetch(`${BASE_URL}/admin/generate`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ semester }),
  });
  return res.json();
};

export const getAdminSchedules = async (token, semester) => {
  const res = await fetch(`${BASE_URL}/admin/schedules?semester=${semester}`, {
    headers: getHeaders(token),
  });
  return res.json();
};

// ── TEACHER ───────────────────────────────────────────
export const getMyCourses = async (token) => {
  const res = await fetch(`${BASE_URL}/teacher/courses`, {
    headers: getHeaders(token),
  });
  return res.json();
};

export const submitVacancy = async (token, data) => {
  const res = await fetch(`${BASE_URL}/teacher/vacancy`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getMyVacancies = async (token, semester) => {
  const res = await fetch(`${BASE_URL}/teacher/vacancies?semester=${semester}`, {
    headers: getHeaders(token),
  });
  return res.json();
};

export const getTeacherSchedule = async (token, semester) => {
  const res = await fetch(`${BASE_URL}/teacher/schedule?semester=${semester}`, {
    headers: getHeaders(token),
  });
  return res.json();
};

// ── STUDENT ───────────────────────────────────────────
export const getStudentSchedule = async (token, semester) => {
  const res = await fetch(`${BASE_URL}/student/schedule?semester=${semester}`, {
    headers: getHeaders(token),
  });
  return res.json();
};
