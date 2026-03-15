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

    const landscape = `# SERVER SETUP & DOCUMENTATION

## Projects Map
1. **ACSES Scholar (Primary)**
   - **Frontend**: /var/www/acses_scholar
     - Technology: Next.js (Port 3000)
     - PM2 Name: acses_frontend (ID: 3)
   - **Backend**: /var/www/acses_backend
     - Technology: Django / Gunicorn (Port 8000)
     - Service: acses_backend.service

2. **Quantum Uz (Previous)**
   - **Frontend**: /root/var/www/Quantum-Uz
     - Status: Stopped (to avoid port conflict on 3000)

## Nginx Structure
- Configuration: /etc/nginx/sites-available/acses_scholar
- Routing:
  - / -> Proxy to 3000 (ACSES Frontend)
  - /api/v1/ -> Proxy to 8000 (ACSES Backend)
  - /django-admin/ -> Proxy to 8000 (ACSES Admin)

## Critical Info
- Database: PostgreSQL (local)
- Port 3000 used by ACSES Frontend
- Port 8000 used by ACSES Backend
`;

    // Write landscape file
    await ssh.execCommand(`echo "${landscape.replace(/"/g, '\\"')}" > /var/www/SERVER_LANDSCAPE.md`);
    console.log("Created /var/www/SERVER_LANDSCAPE.md");

    // Final check
    const list = await ssh.execCommand('pm2 list');
    console.log("Final PM2 Status:\n", list.stdout);

    const backend = await ssh.execCommand('systemctl is-active acses_backend');
    console.log("Backend status:", backend.stdout.trim());

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
