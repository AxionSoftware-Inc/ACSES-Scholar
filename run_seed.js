const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({ host: '62.72.32.37', username: 'root', password: 'Aa7161062.123' });
  const r = await ssh.execCommand('./venv/bin/python3 seed.py', { cwd: '/var/www/acses_backend' });
  console.log(r.stdout);
  console.error(r.stderr);
  process.exit(0);
}
run();
