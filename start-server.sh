#!/bin/bash
cd /home/z/my-project
while true; do
  bunx next dev -p 3000 > /dev/null 2>&1
  sleep 2
done
