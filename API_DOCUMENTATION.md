# 🚀 Neon Club - Complete API Documentation

## 📱 **NURSE APPLICATION APIs** (Primary Focus)

### **🔐 Authentication**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| POST | `/api/register` | Register nurse | `{name, email, password, role: "nurse"}` | User + token |
| POST | `/api/login` | Login nurse | `{email, password}` | User + token |
| GET | `/api/user/me` | Get current nurse profile | - | User profile |

### **📚 Course Catalog & Learning**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/catalog?type=course` | Get all courses | - | Array of courses |
| GET | `/api/catalog?type=workshop` | Get all workshops | - | Array of workshops |
| GET | `/api/catalog?type=program` | Get all programs | - | Array of programs |
| POST | `/api/registration` | Register for course/workshop | `{itemId}` | Registration record |
| GET | `/api/registration` | Get nurse's registrations | - | Array of registrations |

### **🧑‍🏫 Mentorship Booking**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/catalog?type=mentorship` | Get mentorship programs | - | Array of mentorship options |
| POST | `/api/bookings` | Book mentorship session | `{mentorId, itemId, dateTime}` | Booking record |
| GET | `/api/bookings?nurseId=<id>` | Get nurse's bookings | - | Array of bookings |
| GET | `/api/mentor/session/<bookingId>` | Get Zoom session details | - | Session info with join URL |

### **💳 Payments**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| POST | `/api/payments/initiate` | Start payment process | `{itemId, amount, gateway}` | Payment record |
| GET | `/api/payments/history` | Get payment history | - | Array of payments |

### **📝 Assessments & Tests**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/assessments?type=course&courseId=<id>` | Get course assessments | - | Array of assessments |
| GET | `/api/assessments?type=ncc` | Get NCC assessments | - | Array of NCC tests |
| POST | `/api/assessments/<id>/submit` | Submit assessment | `{answers: []}` | Score & result |
| GET | `/api/assessments/attempts` | Get nurse's attempts | - | Array of attempts |
| GET | `/api/assessments/results/<attemptId>` | Get assessment result | - | Detailed result |

### **🏆 NCC Leadership Program**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/ncc` | Get NCC progress status | - | Progress tracking |
| GET | `/api/catalog?type=ncc` | Get NCC programs | - | Array of NCC items |

### **📊 Progress & Feedback**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/feedback?nurseId=<id>` | Get feedback received | - | Array of feedback |

---

## 👨🏫 **MENTOR DASHBOARD APIs**

### **📋 Booking Management**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/mentor/bookings` | Get mentor's bookings | - | Array of bookings |
| GET | `/api/mentor/bookings?status=pending` | Get pending requests | - | Pending bookings |
| PATCH | `/api/mentor/bookings/<id>` | Accept/decline booking | `{status: "confirmed"}` | Updated booking |

### **🎥 Zoom Session Management**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| POST | `/api/mentor/zoom/create` | Create Zoom session | `{bookingId}` | Zoom meeting details |
| GET | `/api/mentor/sessions` | Get mentor's sessions | - | Array of sessions |

### **📝 Feedback System**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| POST | `/api/feedback/<nurseId>` | Submit feedback | `{rating, comments, skills, bookingId}` | Feedback record |
| GET | `/api/feedback?mentorId=<id>` | Get mentor's feedback | - | Array of feedback |

### **📊 Assessment Creation**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| POST | `/api/assessments` | Create assessment | `{title, type, questions, courseId}` | Assessment record |

---

## 🔧 **ADMIN DASHBOARD APIs**

### **🔐 Admin Authentication**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| POST | `/api/admin/login` | Admin login (no registration) | `{username, password}` | Admin token |

### **👥 User Management**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/admin/users` | Get all users | - | Array of users |
| GET | `/api/admin/users?role=nurse` | Get users by role | - | Filtered users |
| POST | `/api/admin/users` | Create user | `{name, email, password, role}` | New user |
| PUT | `/api/admin/users/<id>` | Update user | `{name, email, role}` | Updated user |
| DELETE | `/api/admin/users/<id>` | Delete user | - | Success message |

### **📚 Content Management**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/catalog` | Get all catalog items | - | Array of items |
| POST | `/api/catalog` | Create course/workshop/program | `{type, title, description, schedule, price}` | New item |
| PUT | `/api/catalog/<id>` | Update catalog item | `{title, price, description}` | Updated item |
| DELETE | `/api/catalog/<id>` | Delete catalog item | - | Success message |

### **💰 Payment Management**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/admin/payments` | Get all payments | - | Array of payments |
| GET | `/api/admin/payments?status=completed` | Filter payments | - | Filtered payments |
| PATCH | `/api/payments/<id>` | Update payment status | `{status: "completed"}` | Updated payment |

### **📊 Registration Management**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/admin/registrations` | Get all registrations | - | Array of registrations |
| GET | `/api/admin/registrations?type=course` | Filter by type | - | Filtered registrations |

### **📈 Dashboard Statistics**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/admin/dashboard/stats` | Get dashboard stats | - | Complete statistics |

### **📝 Assessment Management**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| POST | `/api/assessments` | Create assessment | `{title, type, questions, courseId}` | Assessment record |
| GET | `/api/assessments/attempts` | Get all attempts | - | Array of attempts |

### **🏆 NCC Management**
| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/ncc?userId=<id>` | Get user's NCC status | - | NCC progress |
| POST | `/api/ncc/step` | Update NCC progress | `{step, completed, userId}` | Updated status |

---

## 🎯 **NURSE APP - SPECIFIC USER FLOWS**

### **📱 Main Dashboard Screens:**

#### **1. Home/Dashboard Screen**
- `GET /api/user/me` - User profile
- `GET /api/admin/dashboard/stats` - Quick stats
- `GET /api/registration` - Recent registrations

#### **2. Course Catalog Screen**
- `GET /api/catalog?type=course` - All courses
- `GET /api/catalog?type=workshop` - All workshops
- `POST /api/registration` - Register for course

#### **3. My Courses Screen**
- `GET /api/registration` - Enrolled courses
- `GET /api/assessments?type=course` - Course assessments
- `GET /api/payments/history` - Payment history

#### **4. Mentorship Screen**
- `GET /api/catalog?type=mentorship` - Available mentors
- `POST /api/bookings` - Book session
- `GET /api/bookings?nurseId=<id>` - My bookings
- `GET /api/mentor/session/<bookingId>` - Join session

#### **5. Assessments Screen**
- `GET /api/assessments?type=course` - Course tests
- `GET /api/assessments?type=ncc` - NCC tests
- `POST /api/assessments/<id>/submit` - Submit test
- `GET /api/assessments/attempts` - My results

#### **6. NCC Program Screen**
- `GET /api/ncc` - My NCC progress
- `GET /api/catalog?type=ncc` - NCC programs
- `GET /api/assessments?type=ncc` - NCC assessments

#### **7. Profile Screen**
- `GET /api/user/me` - Profile info
- `GET /api/feedback?nurseId=<id>` - Feedback received
- `GET /api/payments/history` - Payment history

#### **8. Payment Screen**
- `POST /api/payments/initiate` - Start payment
- `GET /api/payments/history` - Payment history

---

## 🔗 **API Base URL**
```
http://localhost:5000
```

## 🔑 **Authentication Headers**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📋 **Common Response Formats**

### **Success Response:**
```json
{
  "data": {...},
  "message": "Success"
}
```

### **Error Response:**
```json
{
  "message": "Error description",
  "error": "Error details"
}
```

---

## 🎯 **Next Steps:**
1. **Add your Figma frontend code** to the project
2. **Compare APIs** with your frontend requirements
3. **Identify missing/extra APIs**
4. **Sync and update** as needed

This comprehensive list covers all interfaces with special focus on the **Nurse Application APIs** that your Figma design will need!