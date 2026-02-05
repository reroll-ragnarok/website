# GitHub Actions Setup

## Keep-Alive Workflow

This workflow pings your Render site every 14 minutes to prevent it from sleeping on the free tier.

### Setup Instructions:

1. **Push these files to GitHub:**
   ```bash
   git add .github/
   git commit -m "Add keep-alive workflow"
   git push
   ```

2. **Add your Render URL as a secret:**
   - Go to your GitHub repository
   - Click on **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `RENDER_URL`
   - Value: Your Render site URL (e.g., `https://your-site.onrender.com`)
   - Click **Add secret**

3. **Enable GitHub Actions (if not already enabled):**
   - Go to **Actions** tab
   - If prompted, click **I understand my workflows, go ahead and enable them**

4. **Test the workflow:**
   - Go to **Actions** tab
   - Select **Keep Render Site Awake**
   - Click **Run workflow** → **Run workflow**
   - Wait a few seconds and check if it completes successfully

### How It Works:

- Pings `/api/health` endpoint every 14 minutes
- Runs automatically via GitHub Actions cron schedule
- Uses minimal GitHub Actions minutes (~4 min/month)
- Keeps your Render site from sleeping during active hours

### Manual Trigger:

You can manually trigger the workflow anytime:
1. Go to **Actions** tab
2. Select **Keep Render Site Awake**
3. Click **Run workflow**

### Note:

- GitHub Actions free tier: 2000 minutes/month
- This workflow uses ~1 second per run
- ~3000 runs/month = ~50 minutes used
- Plenty of minutes remaining for other workflows!
