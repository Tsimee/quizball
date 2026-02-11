@echo off
setlocal

REM Πήγαινε στο folder που βρίσκεται το .bat (δηλαδή το project)
cd /d "%~dp0"

echo ==========================
echo   QUIZBALL DEPLOY SCRIPT
echo ==========================

REM Έλεγχος αν είμαστε σε git repo
if not exist ".git" (
  echo [ERROR] Δεν βρήκα .git folder. Τρέχεις το deploy.bat μέσα στο project;
  pause
  exit /b 1
)

REM Δείξε status
echo.
echo [1/4] Git status:
git status

echo.
echo [2/4] Adding changes...
git add .

REM Αν δεν υπάρχει τίποτα για commit, σταμάτα
git diff --cached --quiet
if %errorlevel%==0 (
  echo.
  echo [OK] Δεν υπάρχουν αλλαγές για deploy.
  pause
  exit /b 0
)

REM Μήνυμα commit με timestamp
for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set d=%%a-%%b-%%c
for /f "tokens=1-2 delims=:." %%a in ("%time%") do set t=%%a%%b

set msg=update %d% %t%

echo.
echo [3/4] Commit: "%msg%"
git commit -m "%msg%"

echo.
echo [4/4] Pushing to origin/main...
git push

echo.
echo ==========================
echo   DONE! Ανέβηκε στο GitHub.
echo   Το Vercel θα κάνει deploy αυτόματα.
echo ==========================
pause
endlocal
