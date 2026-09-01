#!/bin/bash
cd "$(dirname "$0")/backend"
PORT=4000 node app.js &
sleep 4
cd ../client
npx vite --port 5173 --host 127.0.0.1 &
sleep 5
echo "Backend: http://127.0.0.1:4000"
echo "Client: http://127.0.0.1:5173"
