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

    console.log("Installing Certbot...");
    await ssh.execCommand('apt-get update');
    await ssh.execCommand('apt-get install -y python3-certbot-nginx');

    console.log(`Requesting SSL certificate for ${domain}...`);
    // Run certbot for domain. --nginx handles config update, --non-interactive is for automation
    // We use --agree-tos and -m to skip interactive prompts
    const certResult = await ssh.execCommand(`certbot --nginx -d ${domain} -d www.${domain} --non-interactive --agree-tos -m admin@${domain}`);
    
    console.log("Certbot Output:", certResult.stdout || certResult.stderr);

    if (certResult.code === 0) {
      console.log(`Success! SSL installed for ${domain}`);
    } else {
      console.log("Certbot encountered an issue. It might be because DNS hasn't fully propagated yet.");
      console.log("I will try a --dry-run to check for structural issues.");
      const dryRun = await ssh.execCommand(`certbot certonly --dry-run --nginx -d ${domain} -d www.${domain} --non-interactive`);
      console.log("Dry run results:", dryRun.stdout || dryRun.stderr);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
