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

    const domain = 'dirac.space';
    const port = 3003;

    const nginxConfig = `server {
    listen 80;
    server_name ${domain} www.${domain};

    location / {
        proxy_pass http://127.0.0.1:${port};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;

    console.log(`Creating Nginx config for ${domain}...`);
    // Write config to sites-available
    await ssh.execCommand(`echo "${nginxConfig.replace(/"/g, '\\"')}" > /etc/nginx/sites-available/${domain}`);
    
    // Create symbolic link to sites-enabled
    console.log("Enabling site...");
    await ssh.execCommand(`ln -sf /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/`);
    
    // Test and reload Nginx
    console.log("Testing Nginx configuration...");
    const test = await ssh.execCommand('nginx -t');
    if (test.code === 0) {
      console.log("Nginx config is valid, reloading...");
      await ssh.execCommand('systemctl reload nginx');
      console.log(`Success! ${domain} is now proxying to port ${port}`);
    } else {
      console.error("Nginx config test FAILED:", test.stderr);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
