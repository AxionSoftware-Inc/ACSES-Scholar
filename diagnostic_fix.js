const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '62.72.32.37',
      username: 'root',
      password: 'Aa7161062.123'
    });
    console.log("Connected");

    // 1. Diagnostics
    console.log("--- Disk Space ---");
    const df = await ssh.execCommand('df -h');
    console.log(df.stdout);

    console.log("--- Nginx Configs ---");
    const nginx = await ssh.execCommand('ls -l /etc/nginx/sites-enabled');
    console.log(nginx.stdout);

    // 2. Clear build cache and rebuild with more memory
    const scholarPath = '/var/www/acses_scholar';
    console.log("--- Rebuilding Scholar ---");
    await ssh.execCommand('rm -rf .next', { cwd: scholarPath });
    
    // Using --max-old-space-size and capturing both out and err
    const build = await ssh.execCommand('export NODE_OPTIONS="--max-old-space-size=4096" && npm run build', { cwd: scholarPath });
    console.log("Build Stdout:", build.stdout);
    console.log("Build Stderr:", build.stderr);

    // 3. Check if build completed
    const checkId = await ssh.execCommand('ls -l .next/BUILD_ID', { cwd: scholarPath });
    console.log("BUILD_ID check:", checkId.stdout || checkId.stderr);

    // 4. Restart services
    console.log("--- Restarting PM2 ---");
    await ssh.execCommand('pm2 restart acses_frontend');
    await ssh.execCommand('systemctl restart acses_backend');

    // 5. Final status
    const status = await ssh.execCommand('pm2 list');
    console.log("Final PM2 status:", status.stdout);

    process.exit(0);
  } catch (err) {
    console.error("Critical Error:", err);
    process.exit(1);
  }
}
run();
