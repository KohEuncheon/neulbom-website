@echo off
REM 1. 작업 폴더로 이동
cd /d C:\Users\k\Desktop\neulbom-website

REM 2. git이 설치되어 있는지 확인
git --version >nul 2>&1
if errorlevel 1 (
    echo [오류] git이 설치되어 있지 않습니다.
    pause
    exit /b
)

REM 3. 원격 저장소 연결 확인
git remote -v
if errorlevel 1 (
    echo [오류] 원격 저장소가 연결되어 있지 않습니다.
    pause
    exit /b
)

REM 4. 변경사항 스테이징
git add .

REM 5. 커밋 (변경사항 없으면 안내)
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "자동 커밋"
) else (
    echo [안내] 커밋할 변경사항이 없습니다.
)

REM 6. main 브랜치로 푸시
git push origin main

echo.
echo ==========================
echo   깃허브 자동 푸시 완료!
echo ==========================
pause 