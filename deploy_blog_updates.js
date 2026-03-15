const { NodeSSH } = require('node-ssh');
const path = require('path');

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '62.72.32.37',
      username: 'root',
      password: 'Aa7161062.123'
    });

    console.log("Connected to server");

    const backendPath = '/var/www/acses_backend';
    const localBase = 'd:\\Complete\\ACSES Scholar\\ACSES Scholar backend';

    const files = [
      'application/models.py',
      'application/serializers.py',
      'application/views.py',
      'application/urls.py',
      'application/admin.py'
    ];

    for (const f of files) {
      const local = path.join(localBase, f);
      const remote = backendPath + '/' + f;
      await ssh.putFile(local, remote);
      console.log(`Uploaded ${f}`);
    }

    console.log("Running migrations...");
    const migResult = await ssh.execCommand('./venv/bin/python3 manage.py makemigrations application && ./venv/bin/python3 manage.py migrate', { cwd: backendPath });
    console.log("Migration Output:", migResult.stdout || migResult.stderr);

    console.log("Restarting backend...");
    await ssh.execCommand('systemctl restart acses_backend');

    console.log("Deploy successful!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
