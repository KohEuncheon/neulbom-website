@echo off
:: 모든 변경사항 add
git add -A

:: 현재 날짜와 시간으로 커밋 메시지 생성
for /f "tokens=1-4 delims=/ " %%i in ("%date% %time%") do set dt=%%i-%%j-%%k_%%l
set msg=auto-commit-%dt%

git commit -m "%msg%"
git push

pause 