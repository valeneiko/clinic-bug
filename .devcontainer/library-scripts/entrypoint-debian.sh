#!/usr/bin/env bash

set -e

tee /usr/local/share/entrypoint.sh > /dev/null << EOF
#!/usr/bin/env bash
set +e
exec "\$@"
EOF

chmod +x /usr/local/share/entrypoint.sh
chown vscode:root /usr/local/share/entrypoint.sh

echo "Done!"