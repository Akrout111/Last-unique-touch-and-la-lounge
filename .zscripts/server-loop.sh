#!/bin/bash
# Auto-restart loop for the production server
# This script runs forever, restarting the server if it crashes

cd /home/z/my-project

while true; do
  echo "[$(date)] Starting server..." >> /tmp/server-loop.log
  node .next/standalone/server.js >> /tmp/server-loop.log 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 2s..." >> /tmp/server-loop.log
  sleep 2
done
