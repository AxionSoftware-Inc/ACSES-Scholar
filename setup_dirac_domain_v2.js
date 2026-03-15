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

    const domain = 'dirac.space';
    const port = 3003;

    // Use a temporary local file strategy or safer echo to avoid escaping issues
    const configPath = `/etc/nginx/sites-available/${domain}`;
    
    // Simpler config to avoid any complex shell interpretation
    const commands = [
      `echo "server {" > ${configPath}`,
      `echo "    listen 80;" >> ${configPath}`,
      `echo "    server_name ${domain} www.${domain};" >> ${configPath}`,
      `echo "" >> ${configPath}`,
      `echo "    location / {" >> ${configPath}`,
      `echo "        proxy_pass http://127.0.0.1:${port};" >> ${configPath}`,
      `echo "        proxy_set_header Host \\$host;" >> ${configPath}`,
      `echo "        proxy_set_header X-Real-IP \\$remote_addr;" >> ${configPath}`,
      `echo "        proxy_set_header X-Forwarded-For \\$proxy_add_x_forwarded_for;" >> ${configPath}`,
      `echo "        proxy_set_header X-Forwarded-Proto \\$scheme;" >> ${configPath}`,
      `echo "    }" >> ${configPath}`,
      `echo "}" >> ${configPath}`
    ];

    for (const cmd of commands) {
      await ssh.execCommand(cmd);
    }

    await ssh.execCommand(`ln -sf ${configPath} /etc/nginx/sites-enabled/`);
    
    const test = await ssh.execCommand('nginx -t');
    if (test.code === 0) {
      await ssh.execCommand('systemctl reload nginx');
      console.log(`Success! ${domain} configured.`);
    } else {
      console.error("FAILED:", test.stderr);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
