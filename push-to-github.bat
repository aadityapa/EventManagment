@echo off
title Push to GitHub
cd /d C:\Users\IT.Pune\Desktop\JIJU
echo Staging changes...
git add -A
echo Committing...
git commit -m "Premium 3D redesign: WebGL hero, cinematic entrances, marquee, scroll progress, ambient aurora"
echo Pushing to origin/master...
git push origin master
echo.
echo Done. Press any key to close.
pause >nul
