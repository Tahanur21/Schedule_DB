# 🧑‍💻 Developer Reference Guide

## Quick Navigation

### New Pages/Components
1. **User Profile** - `/profile`
2. **Course Registration** - `/student/courses`
3. **Conflict Detection** - `/admin/conflicts`
4. **Enhanced Users** - `/admin/users`
5. **Enhanced Courses** - `/admin/courses`
6. **Enhanced Rooms** - `/admin/rooms`

### New Utility Module
- `src/utils/validation.js` - Form validation and helpers

---

## API Usage Examples

### Get User Profile
```javascript
import { getUserProfile } from '../../services/api';

const profile = await getUserProfile(token);
```

### Add User
```javascript
import { addUser } from '../../services/api';

const newUser = await addUser(token, {
  name: "John Doe",
  email: "john@university.edu",
  password: "SecurePass123",
  role: "student",
  department: "Computer Science"
});
```

### Enroll in Course
```javascript
import { enrollCourse } from '../../services/api';

const result = await enrollCourse(token, courseId);
```

### Get Conflicts
```javascript
import { getConflicts } from '../../services/api';

const conflicts = await getConflicts(token, "Spring2025");
```

### Search Users
```javascript
import { searchUsers } from '../../services/api';

const results = await searchUsers(token, "john");
```

---

## Validation Usage

### Import Validation
```javascript
import {
  validateEmail,
  validatePassword,
  validateForm,
  cleanFormData
} from '../../utils/validation';
```

### Validate Email
```javascript
const error = validateEmail("user@example.com");
// Returns: null if valid, error message if invalid
```

### Validate Form
```javascript
const schema = {
  email: {},
  password: { strict: true },
  name: {}
};

const errors = validateForm(formData, schema);
// Returns: { field: error message } or null
```

### Clean Form Data
```javascript
const clean = cleanFormData(formData);
// Trims strings, removes empty fields
```

### Format Messages
```javascript
import { formatSuccessMessage, formatErrorMessage } from '../../utils/validation';

const successMsg = formatSuccessMessage("create", "User");
// "✅ User created successfully!"

const errorMsg = formatErrorMessage(result);
// Extracts error from API response
```

---

## Component Integration

### Using Modal Components (Example from Users.jsx)

```javascript
// State
const [showAddModal, setShowAddModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);

// Handler
const handleAddUser = async (formData) => {
  setIsSubmitting(true);
  const result = await addUser(token, formData);
  if (result.id) {
    setShowAddModal(false);
    fetchUsers(); // Refresh list
  }
  setIsSubmitting(false);
};

// JSX
<button onClick={() => setShowAddModal(true)}>
  ➕ Add User
</button>

<UserFormModal 
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  onSubmit={handleAddUser}
  isLoading={isSubmitting}
/>
```

---

## Form Patterns

### Add/Edit Form
```javascript
import { useState } from 'react';
import { validateField, cleanFormData } from '../../utils/validation';

// State
const [formData, setFormData] = useState({ 
  name: "", 
  email: "", 
  role: "student" 
});
const [errors, setErrors] = useState({});

// Change Handler
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  // Clear error on change
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: "" }));
  }
};

// Submit Handler
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate
  const newErrors = {};
  if (!formData.name) newErrors.name = "Name required";
  if (!formData.email) newErrors.email = "Email required";
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  // Submit
  const clean = cleanFormData(formData);
  const result = await addItem(token, clean);
  // Handle result...
};
```

---

## Search & Filter Pattern

```javascript
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");

// Filter data
const filtered = items.filter((item) => {
  const matchFilter = filter === "all" || item.status === filter;
  const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
  return matchFilter && matchSearch;
});

// JSX
<input
  type="text"
  placeholder="Search..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<select value={filter} onChange={(e) => setFilter(e.target.value)}>
  <option value="all">All</option>
  <option value="active">Active</option>
</select>

{filtered.map(item => (...))}
```

---

## Error Handling Pattern

```javascript
const [message, setMessage] = useState({ type: "", text: "" });

// After API call
if (result.id || result.success) {
  setMessage({ type: "success", text: "✅ Operation successful!" });
} else {
  setMessage({ type: "error", text: result.error || "Operation failed" });
}

// Auto-dismiss
setTimeout(() => setMessage({ type: "", text: "" }), 3000);

// JSX
{message.text && (
  <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
    {message.text}
  </div>
)}
```

---

## Modal Pattern

```javascript
// Props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data) => void;
  isLoading: boolean;
}

// JSX Structure
return (
  <>
    {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
    {isOpen && (
      <div className="fixed ... z-50 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-4">Title</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields */}
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn btn-outline flex-1">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn btn-primary flex-1">
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>
);
```

---

## Common Tasks

### Add New CRUD Page

1. **Create API functions** in `src/services/api.js`
   ```javascript
   export const getItems = async (token) => { /* ... */ };
   export const addItem = async (token, data) => { /* ... */ };
   export const updateItem = async (token, id, data) => { /* ... */ };
   export const deleteItem = async (token, id) => { /* ... */ };
   ```

2. **Create Page Component** in `src/pages/admin/Items.jsx`
   - Import API functions
   - Create form modal component
   - Create delete confirmation modal
   - Add CRUD handlers
   - Implement search/filter

3. **Add Route** in `src/App.jsx`
   ```javascript
   import Items from "./pages/admin/Items";
   <Route path="/admin/items" element={<ProtectedRoute allowedRole="admin"><Items /></ProtectedRoute>} />
   ```

### Add Validation to Form

1. Import validators
2. Create validation schema
3. Validate on submit
4. Display errors
5. Clear errors on change

---

## Debugging Tips

### Check API Response
```javascript
const result = await someApi(token);
console.log("API Result:", result);
console.log("Has ID:", result.id || result.user_id);
console.log("Has Error:", result.error);
```

### Check Form Data
```javascript
console.log("Form Data:", formData);
console.log("Cleaned Data:", cleanFormData(formData));
console.log("Validation Errors:", errors);
```

### Test Loading States
Add `isLoading` state to test button states

### Test Empty States
Filter arrays to 0 items and verify UI

---

## Styling Reference

### Common Classes
```
// Buttons
btn btn-primary btn-outline btn-error btn-sm
rounded-xl

// Cards
bg-white rounded-2xl p-6 border border-primary-100 shadow-sm

// Badges
badge badge-primary badge-success badge-error

// Forms
input input-bordered focus:input-primary rounded-xl
select select-bordered focus:select-primary rounded-xl
textarea textarea-bordered focus:textarea-primary rounded-xl

// Grid
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
```

---

## Performance Tips

### Avoid Unnecessary Re-renders
- Use `useCallback` for handlers
- Memoize expensive computations
- Debounce search inputs

### API Optimization
- Combine related API calls
- Cache frequently accessed data
- Limit search results

### Bundle Size
- Lazy load pages if needed
- Tree-shake unused imports

---

## Testing Checklist

### Form Testing
- [ ] Validation works
- [ ] Errors display
- [ ] Submit works
- [ ] Loading states work
- [ ] Cancel works

### CRUD Testing
- [ ] Create works
- [ ] Read works
- [ ] Update works
- [ ] Delete with confirmation
- [ ] List refreshes

### Search/Filter Testing
- [ ] Search works
- [ ] Filter works
- [ ] Combined filters work
- [ ] No results displays

---

## Resources

- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **DaisyUI**: https://daisyui.com
- **React Router**: https://reactrouter.com

---

## Common Issues & Solutions

### API Returns 401 Unauthorized
- Check token is valid
- Verify token is passed to API
- Check user role permissions

### Form not Submitting
- Check validation errors
- Verify API endpoint exists
- Check form data structure

### Search Not Working
- Verify search term is typed
- Check filter state
- Ensure array is not empty

### Modal not Closing
- Verify onClose is called
- Check modal state update
- Ensure cleanup functions

---

## Convention Notes

- All API errors caught with try-catch or .catch()
- All forms use controlled components
- All modals use Portal pattern (fixed positioning)
- All searches are case-insensitive
- All timestamps formatted with toLocaleDateString()
- All response checks look for `id` OR `user_id` OR `success`

---

**Last Updated**: April 20, 2026
**Version**: 1.0.0
