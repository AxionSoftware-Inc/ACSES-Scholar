const { NodeSSH } = require('node-ssh')
const ssh = new NodeSSH()
const path = require('path')

async function run() {
  try {
    await ssh.connect({
        host: '62.72.32.37',
        username: 'root',
        password: 'Aa7161062.123'
    })
    console.log('Connected!')

    const exec = async (cmd, cwd = '/') => {
      console.log(`Executing: ${cmd}`)
      const result = await ssh.execCommand(cmd, { cwd })
      if (result.stdout) console.log(result.stdout)
      if (result.stderr) console.error(result.stderr)
      return result
    }

    const backendPath = '/var/www/acses_backend'

    // 1. Upload local fixes (Settings and Admin creation)
    console.log('Uploading fixes...')
    await ssh.putFile('./Quantum uz backend/project/settings.py', `${backendPath}/project/settings.py`)
    await ssh.putFile('./Quantum uz backend/create_admin.py', `${backendPath}/create_admin.py`)

    // 2. Run admin creation
    await exec(`./venv/bin/python3 create_admin.py`, backendPath)

    // 3. Update Nginx with full proxy headers
    const nginx = `server {
    listen 80;
    server_name 62.72.32.37;

    location /api/v1/ {
        proxy_pass http://127.0.0.1:8000/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /django-admin/ {
        proxy_pass http://127.0.0.1:8000/django-admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ { alias ${backendPath}/static/; }
    location /media/ { alias ${backendPath}/media/; }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`
    const localTmpNginx = './tmp_nginx_fix.txt'
    const fs = require('fs')
    fs.writeFileSync(localTmpNginx, nginx)
    await ssh.putFile(localTmpNginx, '/etc/nginx/sites-available/acses_scholar')
    fs.unlinkSync(localTmpNginx)

    // 4. Restart services
    await exec("systemctl restart nginx")
    await exec("systemctl restart acses_backend")

    console.log('Login Fix applied!')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
