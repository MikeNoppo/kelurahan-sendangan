# Kelurahan Sendangan - Admin Panel

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Pastikan PostgreSQL sudah running dan buat file `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kelurahan_sendangan"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Generate Prisma Client & Run Migrations
```bash
npx prisma generate
npx prisma db push
```

### 4. Create Admin User
```bash
npm run create-admin
```

Default credentials:
- Email: `admin@kelurahan.go.id`
- Password: `admin123`

⚠️ **Segera ganti password setelah login pertama!**

### 5. Run Development Server
```bash
npm run dev
```

Admin panel: http://localhost:3000/admin/login

## Features

### ✅ Phase 1 - Completed
- [x] NextAuth.js authentication
- [x] Protected admin routes
- [x] Admin layout with sidebar
- [x] Dashboard overview
- [x] Login page

### 🚧 Phase 2 - In Progress
- [x] Posts management UI
- [ ] Posts CRUD API
- [ ] Rich text editor
- [ ] Image upload system
- [ ] Gallery management
- [ ] Potentials management
- [ ] Profile editor
- [ ] Structure management
- [ ] User management

### 📋 Coming Soon
- [ ] Activity logs
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support

## Tech Stack

- **Framework**: Next.js 15
- **Auth**: NextAuth.js v5
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React

## Admin Routes

- `/admin` - Dashboard
- `/admin/login` - Login page
- `/admin/posts` - Posts management
- `/admin/galeri` - Gallery management
- `/admin/potensi` - Potentials management
- `/admin/profil` - Profile editor
- `/admin/struktur` - Structure management
- `/admin/users` - User management
- `/admin/settings` - Settings

## Security

- Password hashing with bcrypt
- JWT-based sessions
- Protected routes via middleware
- CSRF protection (Next.js built-in)
- SQL injection prevention (Prisma ORM)

## Development

### Generate Prisma Client
```bash
npx prisma generate
```

### Database Migrations
```bash
npx prisma db push
```

### View Database
```bash
npx prisma studio
```

### Create New Admin User
```bash
npm run create-admin
```

## License

Private - Kelurahan Sendangan
