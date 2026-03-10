const { NodeSSH } = require('node-ssh')
const ssh = new NodeSSH()

async function run() {
  await ssh.connect({ host: '62.72.32.37', username: 'root', password: 'Aa7161062.123' })
  const r = await ssh.execCommand('tail -n 100 /var/log/nginx/access.log | grep django-admin')
  console.log(r.stdout)
  process.exit(0)
}
run()
