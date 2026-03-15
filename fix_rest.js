const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '62.72.32.37',
      username: 'root',
      password: 'Aa7161062.123'
    });
    console.log("Connected to server...");

    // 1. Fix Quantum Backend
    console.log("Fixing Quantum Backend...");
    await ssh.execCommand('pm2 delete quantum-backend').catch(() => {});
    // Using a simpler approach: start the bash command directly
    const qbResult = await ssh.execCommand('pm2 start "venv/bin/gunicorn --bind 127.0.0.1:8001 project.wsgi:application" --name quantum-backend', {
      cwd: '/root/var/www/Quantum-Uz-Backend'
    });
    console.log("QB Start Result:", qbResult.stdout || qbResult.stderr);

    // 2. Deploy ACSES (v1)
    const acsesDir = '/root/var/www/ACSES';
    console.log("\nDeploying ACSES (v1) on port 3008...");
    console.log("Installing...");
    await ssh.execCommand('npm install', { cwd: acsesDir });
    console.log("Building...");
    const build = await ssh.execCommand('npm run build', { cwd: acsesDir });
    if (build.code === 0) {
      console.log("Starting...");
      await ssh.execCommand('pm2 start npm --name acses-v1 -- start -- -p 3008', { cwd: acsesDir });
    } else {
      console.log("ACSES Build failed:", build.stderr);
    }

    // 3. Final List
    const list = await ssh.execCommand('pm2 list');
    console.log("\n--- FINAL PM2 STATUS ---");
    console.log(list.stdout);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
