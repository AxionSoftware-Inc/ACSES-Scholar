const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '62.72.32.37',
      username: 'root',
      password: 'Aa7161062.123'
    });
    console.log("Connected...");

    // 1. Update Backend CORS
    const backendCwd = '/root/var/www/Quantum-Uz-Backend';
    console.log("Updating Backend CORS...");
    const settingsPath = `${backendCwd}/project/settings.py`;
    
    // Enable CORS_ALLOW_ALL_ORIGINS for testing/production stability
    await ssh.execCommand(`sed -i 's/CORS_ALLOWED_ORIGINS = \\[/CORS_ALLOW_ALL_ORIGINS = True\\n# CORS_ALLOWED_ORIGINS = [/g' ${settingsPath}`);
    
    // 2. Update Frontend .env
    const frontendCwd = '/root/var/www/Quantum-Uz';
    console.log("Updating Frontend .env...");
    await ssh.execCommand('echo "NEXT_PUBLIC_API_URL=http://62.72.32.37:8001" > .env', { cwd: frontendCwd });

    // 3. REBUILD Frontend (Essential for NEXT_PUBLIC variables)
    console.log("Rebuilding Frontend (this takes a minute)...");
    const build = await ssh.execCommand('npm run build', { cwd: frontendCwd });
    console.log("Build Output Snippet:", (build.stdout + build.stderr).slice(-1000));

    // 4. Restart Everything
    console.log("Restarting PM2 processes...");
    await ssh.execCommand('pm2 restart quantum-backend');
    await ssh.execCommand('pm2 restart quantum-frontend');

    console.log("DONE! Please check http://62.72.32.37:3001/ again.");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
