#!/bin/bash
cd /home/z/my-project
while true; do
  bunx next dev --webpack -p 3000 > /dev/null 2>&1
  echo "Server crashed, restarting in 2s..." > /tmp/server-restart.log
  sleep 2
done
