# Vercel Deployment Guide

This guide will help you deploy the Log Ingestion and Querying System to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Vercel CLI** (optional): `npm i -g vercel`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository: `https://github.com/Goldenmist00/Log-query-interface.git`

2. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: Leave empty (monorepo setup)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install`

3. **Environment Variables**
   Set these environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-app-name.vercel.app/api
   NODE_ENV=production
   CORS_ORIGIN=https://your-app-name.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-app-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: log-query-interface
   - Directory: ./frontend
   - Override settings: Yes if needed

## Important Notes

### Limitations in Serverless Environment

1. **WebSocket Support**: 
   - Vercel serverless functions don't support persistent WebSocket connections
   - Real-time features are disabled in production deployment
   - Consider using Vercel Edge Functions or external WebSocket service for real-time features

2. **File Storage**:
   - Serverless functions have read-only file systems
   - Log data persistence will not work as expected
   - Consider using:
     - Vercel KV (Redis-compatible)
     - External database (PostgreSQL, MongoDB)
     - Vercel Postgres

### Recommended Improvements for Production

1. **Database Migration**
   ```bash
   # Add Vercel Postgres
   npm install @vercel/postgres
   ```

2. **Environment Variables**
   - Set `VITE_API_URL` to your Vercel app URL
   - Configure `CORS_ORIGIN` for your domain
   - Add database connection strings if using external DB

3. **Real-time Features**
   - Consider Pusher, Ably, or Socket.io for WebSocket functionality
   - Use Vercel Edge Functions for better real-time support

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure all dependencies are in package.json
   - Check TypeScript configuration
   - Verify build command works locally

2. **API Routes Not Working**
   - Check `vercel.json` configuration
   - Ensure API routes are in `/api` directory
   - Verify CORS settings

3. **Environment Variables**
   - Set in Vercel dashboard under Project Settings > Environment Variables
   - Redeploy after adding new environment variables

### Build Commands

If you encounter build issues, try these commands:

```bash
# Frontend build
cd frontend && npm install && npm run build

# Backend dependencies (for API routes)
cd backend && npm install
```

## Post-Deployment

1. **Test the Application**
   - Visit your Vercel URL
   - Test log filtering and search
   - Verify analytics dashboard works
   - Check API endpoints: `/api/logs`

2. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor function execution times
   - Check error logs in Vercel dashboard

3. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Update environment variables with new domain

## Support

For deployment issues:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- Project repository: [github.com/Goldenmist00/Log-query-interface](https://github.com/Goldenmist00/Log-query-interface)