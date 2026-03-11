const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({ host: '62.72.32.37', username: 'root', password: 'Aa7161062.123' });
  console.log("Rebuilding frontend...");
  const r = await ssh.execCommand('npm run build && pm2 restart acses_frontend', { cwd: '/var/www/acses_scholar' });
  console.log(r.stdout);
  console.error(r.stderr);
  process.exit(0);
}
run();
