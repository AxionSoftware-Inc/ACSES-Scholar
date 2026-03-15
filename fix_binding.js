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

    console.log("Restarting Quantum Backend with 0.0.0.0 binding...");
    await ssh.execCommand('pm2 delete quantum-backend').catch(() => {});
    
    // Bind to 0.0.0.0 to allow external access
    const result = await ssh.execCommand('pm2 start "venv/bin/gunicorn --bind 0.0.0.0:8001 project.wsgi:application" --name quantum-backend', {
      cwd: '/root/var/www/Quantum-Uz-Backend'
    });
    
    console.log("Result:", result.stdout || result.stderr);

    const netstats = await ssh.execCommand('netstat -tulpn | grep 8001');
    console.log("Port check:\n", netstats.stdout);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
