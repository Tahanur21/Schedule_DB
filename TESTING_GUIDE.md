# 🧪 Testing Guide & Test Cases

## Manual Testing Instructions

### Prerequisites
1. Backend server running on `http://127.0.0.1:5000`
2. Frontend running on `http://localhost:5173` (Vite default)
3. Test user accounts created with different roles

---

## Test User Accounts

### Admin Account
- Email: `admin@university.edu`
- Password: `AdminPass123`
- Role: Administrator

### Teacher Account
- Email: `teacher@university.edu`
- Password: `TeacherPass123`
- Role: Teacher

### Student Account
- Email: `student@university.edu`
- Password: `StudentPass123`
- Role: Student

---

## Feature Test Cases

## 📝 USER MANAGEMENT (Admin)

### Test Case 1.1: View All Users
**Path**: `/admin/users`
**Steps**:
1. Login as admin
2. Navigate to Users page
3. Verify user list displays

**Expected Results**:
- [ ] User table loads with data
- [ ] Search box visible
- [ ] Filter dropdown visible
- [ ] Add User button visible

### Test Case 1.2: Search Users
**Path**: `/admin/users`
**Steps**:
1. Go to Users page
2. Type name in search box: "John"
3. Observe results

**Expected Results**:
- [ ] Results filter in real-time
- [ ] Only matching users display
- [ ] Case-insensitive search works

### Test Case 1.3: Filter Users by Role
**Path**: `/admin/users`
**Steps**:
1. Go to Users page
2. Click filter dropdown
3. Select "Student"

**Expected Results**:
- [ ] List filters to show only students
- [ ] Filter indicator shows selected role
- [ ] Count updates accordingly

### Test Case 1.4: Add New User
**Path**: `/admin/users`
**Steps**:
1. Click "➕ Add User" button
2. Fill form:
   - Name: "Test User"
   - Email: "test@university.edu"
   - Password: "TestPass123"
   - Role: "Student"
   - Department: "Engineering"
3. Click "Add User"

**Expected Results**:
- [ ] Modal opens
- [ ] Form validates input
- [ ] Success message shows
- [ ] New user appears in list

### Test Case 1.5: Edit User
**Path**: `/admin/users`
**Steps**:
1. Click edit button on any user
2. Change name to "Updated Name"
3. Click "Update User"

**Expected Results**:
- [ ] Modal opens with user data pre-filled
- [ ] Changes saved successfully
- [ ] List updates with new name

### Test Case 1.6: Delete User with Confirmation
**Path**: `/admin/users`
**Steps**:
1. Click delete button on a user
2. Confirm deletion in modal

**Expected Results**:
- [ ] Confirmation modal appears
- [ ] User deleted from list
- [ ] Success message shows

### Test Case 1.7: Validation - Empty Fields
**Path**: `/admin/users`
**Steps**:
1. Click "Add User"
2. Leave all fields empty
3. Click "Add User"

**Expected Results**:
- [ ] Error messages appear
- [ ] Form doesn't submit
- [ ] Required fields highlighted

### Test Case 1.8: Validation - Invalid Email
**Path**: `/admin/users`
**Steps**:
1. Click "Add User"
2. Enter email: "invalid-email"
3. Try to submit

**Expected Results**:
- [ ] Email validation error shows
- [ ] Form prevents submission

---

## 📚 COURSE MANAGEMENT (Admin)

### Test Case 2.1: View All Courses
**Path**: `/admin/courses`
**Steps**:
1. Login as admin
2. Navigate to Courses page

**Expected Results**:
- [ ] Course list displays
- [ ] Statistics cards show totals
- [ ] Donut chart renders

### Test Case 2.2: Toggle View - Table to Card
**Path**: `/admin/courses`
**Steps**:
1. Go to Courses page
2. Click view toggle button

**Expected Results**:
- [ ] View switches between table and cards
- [ ] Both views show same data

### Test Case 2.3: Add Course
**Path**: `/admin/courses`
**Steps**:
1. Click "➕ Add Course"
2. Fill form:
   - Code: "CS101"
   - Name: "Intro to CS"
   - Credits: "3"
   - Level: "100"
   - Department: "Computer Science"
3. Click "Add Course"

**Expected Results**:
- [ ] Modal opens
- [ ] Course added successfully
- [ ] Appears in list
- [ ] Stats update

### Test Case 2.4: Edit Course
**Path**: `/admin/courses`
**Steps**:
1. Click edit on any course
2. Change name
3. Click "Update"

**Expected Results**:
- [ ] Modal pre-fills data
- [ ] Changes save
- [ ] List updates

### Test Case 2.5: Delete Course
**Path**: `/admin/courses`
**Steps**:
1. Click delete on a course
2. Confirm in modal

**Expected Results**:
- [ ] Confirmation appears
- [ ] Course removed
- [ ] Stats update

### Test Case 2.6: Search Courses
**Path**: `/admin/courses`
**Steps**:
1. Type "CS" in search
2. Observe results

**Expected Results**:
- [ ] Results filter in real-time
- [ ] Only matching courses show

### Test Case 2.7: Filter by Level
**Path**: `/admin/courses`
**Steps**:
1. Click level filter
2. Select "200"

**Expected Results**:
- [ ] Only 200-level courses show
- [ ] Count updates

---

## 🏛️ ROOM MANAGEMENT (Admin)

### Test Case 3.1: View Rooms
**Path**: `/admin/rooms`
**Steps**:
1. Go to Rooms page

**Expected Results**:
- [ ] Room list displays
- [ ] Capacity bars visible
- [ ] Building info shows

### Test Case 3.2: Add Room
**Path**: `/admin/rooms`
**Steps**:
1. Click "➕ Add Room"
2. Fill form:
   - Room: "A-101"
   - Capacity: "50"
   - Building: "Science"
3. Click "Add"

**Expected Results**:
- [ ] Room added
- [ ] Appears in list
- [ ] Capacity shows correctly

### Test Case 3.3: Edit Room
**Path**: `/admin/rooms`
**Steps**:
1. Click edit button
2. Change capacity to "60"
3. Click "Update"

**Expected Results**:
- [ ] Data pre-fills
- [ ] Update successful
- [ ] Capacity updates in list

### Test Case 3.4: Delete Room
**Path**: `/admin/rooms`
**Steps**:
1. Click delete
2. Confirm

**Expected Results**:
- [ ] Room removed
- [ ] List updates

### Test Case 3.5: Search Rooms
**Path**: `/admin/rooms`
**Steps**:
1. Type "A-" in search
2. Observe results

**Expected Results**:
- [ ] Results filter

---

## 📋 STUDENT COURSE REGISTRATION

### Test Case 4.1: View Available Courses
**Path**: `/student/courses`
**Steps**:
1. Login as student
2. Navigate to Course Registration

**Expected Results**:
- [ ] Available courses display
- [ ] Course cards show details
- [ ] Stats cards visible

### Test Case 4.2: Enroll in Course
**Path**: `/student/courses`
**Steps**:
1. Click "Enroll" on any course
2. Confirm action

**Expected Results**:
- [ ] Button changes to "Enrolled"
- [ ] Course appears in "Enrolled Courses"
- [ ] Total credits update
- [ ] Success message shows

### Test Case 4.3: Withdraw from Course
**Path**: `/student/courses`
**Steps**:
1. Find enrolled course
2. Click "Withdraw"
3. Confirm

**Expected Results**:
- [ ] Course removed from enrolled
- [ ] Button changes back to "Enroll"
- [ ] Credits update
- [ ] Success message shows

### Test Case 4.4: View Enrolled Courses Summary
**Path**: `/student/courses`
**Steps**:
1. Go to Course Registration
2. Look at "Your Enrolled Courses" section

**Expected Results**:
- [ ] Shows all enrolled courses
- [ ] Total credits accurate
- [ ] Can withdraw from here

### Test Case 4.5: Search Courses
**Path**: `/student/courses`
**Steps**:
1. Type course name in search

**Expected Results**:
- [ ] Results filter
- [ ] Real-time search works

### Test Case 4.6: Filter by Status
**Path**: `/student/courses`
**Steps**:
1. Click "Enrolled" filter tab

**Expected Results**:
- [ ] Shows only enrolled courses
- [ ] Click "Available" shows all available

### Test Case 4.7: Semester Selector
**Path**: `/student/courses`
**Steps**:
1. Change semester dropdown
2. Observe results

**Expected Results**:
- [ ] List updates to new semester
- [ ] Enrolled status resets if no data

---

## 👤 USER PROFILE

### Test Case 5.1: View Profile
**Path**: `/profile`
**Steps**:
1. Any logged-in user
2. Navigate to Profile page

**Expected Results**:
- [ ] Profile card displays
- [ ] Shows name, email, phone, role
- [ ] Avatar initial shows
- [ ] Edit button visible

### Test Case 5.2: Edit Profile
**Path**: `/profile`
**Steps**:
1. Click "Edit Profile" button
2. Change name: "New Name"
3. Change phone: "555-1234"
4. Click "Save Changes"

**Expected Results**:
- [ ] Form switches to edit mode
- [ ] Changes save
- [ ] Success message shows
- [ ] Profile updates

### Test Case 5.3: Change Password
**Path**: `/profile`
**Steps**:
1. Click "🔒 Change Password"
2. Enter:
   - Current: "OldPass123"
   - New: "NewPass123"
   - Confirm: "NewPass123"
3. Click "Change Password"

**Expected Results**:
- [ ] Modal opens
- [ ] Validates passwords match
- [ ] Success message shows
- [ ] Can login with new password

### Test Case 5.4: Password Validation
**Path**: `/profile`
**Steps**:
1. Click "Change Password"
2. Enter weak password
3. Try to submit

**Expected Results**:
- [ ] Validation error shows
- [ ] Requires strong password
- [ ] Can't submit

### Test Case 5.5: Cancel Edit
**Path**: `/profile`
**Steps**:
1. Click Edit
2. Change name
3. Click "Cancel"

**Expected Results**:
- [ ] Changes discarded
- [ ] Original data shows

---

## ⚠️ CONFLICT DETECTION

### Test Case 6.1: View Conflicts
**Path**: `/admin/conflicts`
**Steps**:
1. Login as admin
2. Navigate to Conflicts page

**Expected Results**:
- [ ] Conflict list displays (if any exist)
- [ ] Stats show total/unresolved/resolved
- [ ] Conflict type icons visible

### Test Case 6.2: Filter by Status
**Path**: `/admin/conflicts`
**Steps**:
1. Click "Unresolved" filter

**Expected Results**:
- [ ] Shows only unresolved conflicts
- [ ] Count accurate
- [ ] Filter button highlighted

### Test Case 6.3: Change Semester
**Path**: `/admin/conflicts`
**Steps**:
1. Click semester dropdown
2. Select "Fall 2025"

**Expected Results**:
- [ ] List updates to new semester
- [ ] Conflicts for that semester show

### Test Case 6.4: Resolve Conflict
**Path**: `/admin/conflicts`
**Steps**:
1. Click "🔧 Resolve" on any conflict
2. Select action: "Reschedule Course"
3. Enter new time: "Tuesday 10-11:30 AM"
4. Add notes: "Moved to avoid overlap"
5. Click "Submit Resolution"

**Expected Results**:
- [ ] Modal opens
- [ ] Resolution saved
- [ ] Conflict status updates
- [ ] Removed from unresolved list

### Test Case 6.5: Refresh Conflicts
**Path**: `/admin/conflicts`
**Steps**:
1. Click "🔄 Refresh" button

**Expected Results**:
- [ ] List reloads
- [ ] Latest data shows

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Test Case 7.1: Protected Routes - Student Accessing Admin Page
**Path**: Login as student, try `/admin/users`
**Expected Results**:
- [ ] Redirect to Unauthorized page
- [ ] Error message shows

### Test Case 7.2: Protected Routes - Admin Can Access All
**Path**: Login as admin, navigate admin pages
**Expected Results**:
- [ ] All admin routes accessible
- [ ] Student/Teacher routes not accessible

### Test Case 7.3: Token Persistence
**Path**: Login, refresh page
**Expected Results**:
- [ ] Still logged in
- [ ] Token preserved
- [ ] Data loads

### Test Case 7.4: Logout
**Path**: Any page, click logout
**Expected Results**:
- [ ] Token cleared
- [ ] Redirected to login
- [ ] Can't access protected routes

---

## 🐛 ERROR HANDLING TESTS

### Test Case 8.1: API Error - Network Down
**Path**: Any CRUD operation with backend offline
**Expected Results**:
- [ ] Error message displays
- [ ] User sees friendly message
- [ ] Retry button available

### Test Case 8.2: Form Validation Error
**Path**: Any form, invalid input
**Expected Results**:
- [ ] Error message shows
- [ ] Field highlights
- [ ] Submit blocked

### Test Case 8.3: Empty List State
**Path**: Search with no results
**Expected Results**:
- [ ] "No results" message shows
- [ ] Friendly emoji shows
- [ ] No data display errors

### Test Case 8.4: Loading State
**Path**: Any async operation
**Expected Results**:
- [ ] Loading spinner shows
- [ ] Button disabled during load
- [ ] Prevents double-clicks

---

## 📱 RESPONSIVE DESIGN TESTS

### Test Case 9.1: Desktop View
**Path**: Any page on desktop (1920x1080)
**Expected Results**:
- [ ] All elements visible
- [ ] Proper spacing
- [ ] No overflow

### Test Case 9.2: Tablet View
**Path**: Any page on tablet (768x1024)
**Expected Results**:
- [ ] Layout adapts
- [ ] Touch-friendly buttons
- [ ] No horizontal scroll

### Test Case 9.3: Mobile View
**Path**: Any page on mobile (375x667)
**Expected Results**:
- [ ] Single column layout
- [ ] All buttons accessible
- [ ] Text readable

---

## ✅ VALIDATION TESTS

### Test Case 10.1: Email Validation
**Inputs to Test**:
- [ ] Valid: "user@university.edu" ✓
- [ ] Invalid: "user@" ✗
- [ ] Invalid: "user.edu" ✗

### Test Case 10.2: Password Validation
**Requirements**: 8+ chars, uppercase, number, special
**Inputs to Test**:
- [ ] Valid: "SecurePass123!" ✓
- [ ] Invalid: "pass123" ✗
- [ ] Invalid: "PASSWORD123" ✗

### Test Case 10.3: Name Validation
**Inputs to Test**:
- [ ] Valid: "John Doe" ✓
- [ ] Invalid: "J" ✗
- [ ] Invalid: "123" ✗

### Test Case 10.4: Numeric Fields
**Tests**:
- [ ] Capacity: Only numbers
- [ ] Credits: Only 1-4
- [ ] Year: 2000-2099

---

## 🎯 Performance Tests

### Test Case 11.1: Page Load Time
**Measurement**:
- [ ] Initial load < 3 seconds
- [ ] Data render < 1 second

### Test Case 11.2: Search Performance
**Test**: Search through 1000+ items
**Expected Results**:
- [ ] Results in < 500ms
- [ ] Debounce prevents lag

### Test Case 11.3: Modal Opening
**Expected Results**:
- [ ] Opens instantly
- [ ] No lag or stutter

---

## 📊 Data Integrity Tests

### Test Case 12.1: Data Consistency
**Test**: Create item, refresh, verify it still exists
**Expected Results**:
- [ ] Data persists
- [ ] No corruption

### Test Case 12.2: Concurrent Operations
**Test**: Open multiple modals
**Expected Results**:
- [ ] Each operates independently
- [ ] No data conflicts

### Test Case 12.3: Delete Confirmation
**Test**: Delete item, cancel, item still exists
**Expected Results**:
- [ ] Cancellation works
- [ ] Data not deleted

---

## 🔄 Integration Tests

### Test Case 13.1: User Workflow - Full Student Flow
**Steps**:
1. Login as student
2. Navigate to courses
3. Enroll in course
4. View profile
5. Change password

**Expected Results**:
- [ ] All steps work smoothly
- [ ] No errors

### Test Case 13.2: Admin Workflow - Full Workflow
**Steps**:
1. Add new user
2. Create course
3. Assign instructor
4. Check conflicts
5. Resolve conflict

**Expected Results**:
- [ ] All CRUD operations work
- [ ] Data consistency maintained

---

## 📝 Regression Test Checklist

After any code changes, verify:
- [ ] All buttons still work
- [ ] All modals still open/close
- [ ] All validation still works
- [ ] All API calls still work
- [ ] All forms still submit
- [ ] No console errors
- [ ] No broken links
- [ ] Styling not broken
- [ ] Authentication still works
- [ ] Authorization still works

---

## 🚀 Deployment Checklist

Before deployment:
- [ ] All test cases pass
- [ ] No console errors
- [ ] No broken links
- [ ] Environment variables set
- [ ] Backend API running
- [ ] CORS configured
- [ ] Error handling in place
- [ ] Loading states working
- [ ] Responsive design verified
- [ ] Performance acceptable

---

## 📞 Known Issues & Workarounds

### Issue: Modal doesn't close
**Workaround**: Refresh page

### Issue: Search lag on large datasets
**Workaround**: Use more specific search terms

### Issue: Token expired mid-session
**Workaround**: Logout and login again

---

## 🐛 Bug Report Template

Use this when reporting bugs:

```
Title: [Brief description]
Severity: Low/Medium/High/Critical
Environment: Browser/Version
Steps to Reproduce:
1. 
2. 
3. 
Expected Result:
Actual Result:
Screenshots: [if applicable]
```

---

**Last Updated**: April 20, 2026
**Version**: 1.0.0
