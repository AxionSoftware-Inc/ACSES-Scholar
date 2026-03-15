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

    console.log("Stopping frontend to stop the loop...");
    await ssh.execCommand('pm2 stop acses_frontend');

    console.log("Checking Nginx sites...");
    const sites = await ssh.execCommand('ls /etc/nginx/sites-enabled');
    console.log("Enabled sites:", sites.stdout);

    console.log("Cleaning and Rebuilding...");
    // Let's remove .next first to ensure a clean build
    await ssh.execCommand('rm -rf .next', { cwd: '/var/www/acses_scholar' });
    const build = await ssh.execCommand('npm run build', { cwd: '/var/www/acses_scholar' });
    console.log("Build Output:", build.stdout);
    console.log("Build Error (if any):", build.stderr);

    console.log("Starting frontend...");
    await ssh.execCommand('pm2 start acses_frontend');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
