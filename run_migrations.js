const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({ host: '62.72.32.37', username: 'root', password: 'Aa7161062.123' });
  const r1 = await ssh.execCommand('./venv/bin/python3 manage.py makemigrations && ./venv/bin/python3 manage.py migrate', { cwd: '/var/www/acses_backend' });
  console.log(r1.stdout);
  console.error(r1.stderr);
  process.exit(0);
}
run();
