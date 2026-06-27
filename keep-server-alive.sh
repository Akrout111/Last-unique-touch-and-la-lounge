#!/bin/bash
# Keep-alive script for Next.js dev server
cd /home/z/my-project
while true; do
  bunx next dev -p 3000 > /tmp/nextdev.log 2>&1
  echo "[$(date)] Server crashed, restarting in 3s..." >> /tmp/nextdev-restart.log
  sleep 3
done
