# Database Connection Troubleshooting Guide

## Error Explanation

The error "Can't reach database server" means Prisma cannot connect to your Neon PostgreSQL database. This is a **connection issue**, not a code error.

## Common Causes & Solutions

### 1. Check Your DATABASE_URL Format

Your DATABASE_URL should look like this:
```
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

For Neon, it typically looks like:
```
DATABASE_URL="postgresql://username:password@ep-spring-bird-aduj3vn4-pooler.c-2.us-east-1.aws.neon.tech:5432/database?sslmode=require"
```

### 2. Verify Database is Active

- Go to your Neon dashboard: https://console.neon.tech
- Check if your database is **active** (not paused)
- If paused, click "Resume" to activate it

### 3. Check Connection String

- In Neon dashboard, go to your project
- Click on "Connection Details" or "Connection String"
- Copy the **Connection String** (not the connection pooler URL)
- Make sure it includes `?sslmode=require` at the end

### 4. Test Connection Manually

You can test if the database is reachable using psql or a database client:
```bash
psql "your-database-url-here"
```

### 5. Common Issues

**Issue: Database URL missing sslmode**
- **Fix**: Add `?sslmode=require` to the end of your DATABASE_URL

**Issue: Wrong password**
- **Fix**: Reset password in Neon dashboard and update .env.local

**Issue: Database paused**
- **Fix**: Resume database in Neon dashboard

**Issue: Firewall blocking**
- **Fix**: Check if your IP is allowed (Neon usually allows all by default)

**Issue: Using wrong connection string**
- **Fix**: Use the "Connection String" not "Connection Pooler" URL for Prisma migrations

## Quick Fix Steps

1. **Open your `.env.local` file**
2. **Check DATABASE_URL** - Make sure it's correct and complete
3. **Verify in Neon Dashboard**:
   - Database is active
   - Copy the correct connection string
   - Ensure password is correct
4. **Update `.env.local`** with the correct DATABASE_URL
5. **Try again**: `npm run db:push`

## Example Correct DATABASE_URL

```env
DATABASE_URL="postgresql://neondb_owner:your_password@ep-spring-bird-aduj3vn4-pooler.c-2.us-east-1.aws.neon.tech:5432/neondb?sslmode=require"
```

**Important Notes:**
- Replace `your_password` with your actual password
- Replace `neondb` with your actual database name
- The `?sslmode=require` is **required** for Neon

## Still Having Issues?

1. Double-check your `.env.local` file exists
2. Make sure DATABASE_URL is on a single line (no line breaks)
3. Verify the database name, username, and password are correct
4. Try creating a new database in Neon if the current one has issues
5. Check Neon status page for any service issues

