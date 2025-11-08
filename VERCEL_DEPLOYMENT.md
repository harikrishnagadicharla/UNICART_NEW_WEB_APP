# Vercel Deployment Guide

## Pre-Deployment Checklist

### ✅ Configuration Files
- [x] `package.json` - Contains all required scripts and dependencies
- [x] `next.config.js` - Configured with image optimization
- [x] `vercel.json` - Created with proper build settings
- [x] `tsconfig.json` - TypeScript configuration
- [x] `.gitignore` - Properly configured
- [x] `prisma/schema.prisma` - Database schema defined
- [x] `postinstall` script - Prisma generate on install

### ✅ Environment Variables Required

Set these in Vercel Dashboard → Settings → Environment Variables:

#### Required Variables:
```
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
```

#### Optional Variables (for email functionality):
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@unicart.com
```

#### Optional Variables (for seeding):
```
ADMIN_EMAIL=admin@unicart.com
ADMIN_PASSWORD=your-secure-admin-password
```

## Deployment Steps

### 1. Prepare Your Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub/GitLab/Bitbucket
3. Click "Add New Project"
4. Import your repository

### 3. Configure Environment Variables
1. In Vercel project settings, go to "Environment Variables"
2. Add all required variables listed above
3. Set `NEXTAUTH_URL` to your production domain (e.g., `https://your-app.vercel.app`)
4. Generate strong secrets:
   ```bash
   # Generate JWT_SECRET
   openssl rand -base64 32
   
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   ```

### 4. Database Setup
1. **Neon PostgreSQL**:
   - Create a Neon project at [neon.tech](https://neon.tech)
   - Copy the connection string
   - Add `?sslmode=require` to the end
   - Set as `DATABASE_URL` in Vercel

2. **Run Migrations**:
   - Vercel will run `npm install` which triggers `postinstall` → `prisma generate`
   - For initial setup, you may need to run migrations manually:
     ```bash
     # In Vercel CLI or via GitHub Actions
     npx prisma migrate deploy
     ```

3. **Seed Database** (Optional):
   ```bash
   npm run db:seed
   ```

### 5. Deploy
1. Vercel will automatically detect Next.js
2. Build command: `npm run build` (default)
3. Output directory: `.next` (default)
4. Install command: `npm install` (default)

### 6. Post-Deployment

#### Verify Deployment
1. Check build logs for errors
2. Test API endpoints:
   - `GET /api/categories`
   - `GET /api/products`
   - `POST /api/auth/login`
3. Test authentication flow
4. Test cart and wishlist functionality

#### Database Migrations
If you need to run migrations after deployment:
```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

## Production Considerations

### Performance
- ✅ Image optimization configured in `next.config.js`
- ✅ SWC minification enabled
- ✅ React Strict Mode enabled
- ✅ API routes have 30s timeout (configured in `vercel.json`)

### Security
- ✅ Environment variables stored securely in Vercel
- ✅ JWT secrets should be strong (32+ characters)
- ✅ Database connection uses SSL (`?sslmode=require`)
- ✅ No hardcoded secrets in code

### Monitoring
- Check Vercel Analytics for performance metrics
- Monitor API route logs in Vercel dashboard
- Set up error tracking (e.g., Sentry) if needed

## Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure `DATABASE_URL` is correct
4. Check Prisma client generation: `npx prisma generate`

### Database Connection Issues
1. Verify `DATABASE_URL` includes `?sslmode=require`
2. Check Neon database is not paused
3. Verify IP allowlist (if applicable)

### API Routes Not Working
1. Check function logs in Vercel dashboard
2. Verify authentication tokens are valid
3. Check CORS settings if needed

### Environment Variables Not Loading
1. Ensure variables are set for "Production" environment
2. Redeploy after adding new variables
3. Check variable names match exactly (case-sensitive)

## Vercel Configuration

The `vercel.json` file includes:
- Build command: `npm run build`
- Framework detection: Next.js
- Function timeout: 30 seconds for API routes
- Region: `iad1` (US East)

## Next Steps After Deployment

1. **Set up custom domain** (optional):
   - Go to Vercel project settings → Domains
   - Add your custom domain
   - Update `NEXTAUTH_URL` to match

2. **Enable Analytics**:
   - Vercel Analytics provides performance insights
   - Enable in project settings

3. **Set up monitoring**:
   - Consider adding error tracking (Sentry)
   - Set up uptime monitoring
   - Configure alerts for critical errors

4. **Database backups**:
   - Configure automated backups in Neon
   - Set up point-in-time recovery

## Support

For issues:
- Check Vercel deployment logs
- Review Next.js documentation
- Check Prisma documentation for database issues

