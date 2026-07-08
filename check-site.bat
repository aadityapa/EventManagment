@echo off
title Site check
curl -s -m 300 -o "C:\Users\IT.Pune\Desktop\JIJU\preview-home.html" http://localhost:3000/
echo %errorlevel% > "C:\Users\IT.Pune\Desktop\JIJU\preview-status.txt"
exit
