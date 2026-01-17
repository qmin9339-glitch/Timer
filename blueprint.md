# Timer Application Blueprint

## Overview

This is a timer application that allows users to set a time, start, stop, and reset the timer. It also includes preset time options for convenience.

## Features

*   **Timer Display:** Shows hours, minutes, and seconds. The time is editable.
*   **Distraction-Free Timer View:** When the timer is running, the screen shows only the timer numbers (enlarged) and the "Stop" button.
*   **Continuous Looping Alarm:** When the timer finishes, the alarm sound loops indefinitely until the "Stop" button is pressed.
*   **Stop Button Reverts Display:** Pressing the "Stop" button stops the continuous alarm and reverts the display to the initial screen, showing all controls.
*   **Retain Last Timer Setting:** Upon returning to the initial screen after an alarm, the timer input fields retain the last set time.
*   **Preset Times:** Buttons for 10s, 20s, 30s, 1m, 2m, 3m, 5m, and 10m.
*   **Controls:** Start, Stop, and Reset buttons.
*   **Web Components:** The timer will be built as a Web Component for encapsulation and reusability.
*   **Modern Design:** The application will have a clean and modern user interface.
*   **Sound Notification:** Plays a sound when the timer finishes, with a button to toggle sound on/off.
*   **Dark/Light Mode:** A button to switch between dark and light themes.
*   **Animation:** A line-art animation of a moving mouse is displayed while the timer is running.
*   **Responsive Design:** The layout is optimized for mobile devices.

## Implemented Changes

*   **Google Analytics Integration:** Added Google Analytics (gtag.js) script to `index.html` for tracking website usage.
*   **Korean Localization (Rolled Back):** The application's user interface has been reverted from Korean to English.
*   **MS Clarity Integration:** Added MS Clarity script to `index.html` for web analytics and session recording.
*   **ads.txt 파일 추가:** 애드센스 게시자 ID를 사용하여 `ads.txt` 파일을 생성하고 루트 디렉토리에 배치했습니다.
*   **청록색 파비콘으로 업데이트:** 파비콘의 색상을 청록색 계열로 변경하여 시인성을 개선했습니다.
*   **검색 엔진 최적화(SEO) 적용 및 `robots.txt` 보충:** Google 및 Naver 가이드라인에 따라 메타 태그, 표준 URL, `sitemap.xml` 등을 최적화하고, `robots.txt` 파일에 추가적인 Disallow 규칙 및 `sitemap.xml`에 대한 명시적인 Allow 규칙을 적용했습니다.
*   **소셜 공유 버튼 이모지 및 좌측 상단 배치로 재설계:** 웹사이트의 소셜 공유 버튼을 이모티콘으로 변경하고, 페이지의 좌측 상단에 배치되도록 디자인을 재설계했습니다.
*   **Userback 피드백 버튼 추가:** Userback 스크립트가 통합되었고, 상단 우측에 이모지(📝) 형태의 피드백 버튼이 추가되었습니다.

## Current Plan

1.  **Update `blueprint.md`:** Reflect new UI and animation requirements.
2.  **Save `mouse.png`:** Find and save a suitable mouse image.
3.  **Update `style.css`:**
    *   Add a `.timer-running` class to the body to control visibility of elements.
    *   Hide non-essential elements and enlarge the timer display in the `.timer-running` state.
    *   Update the animation to use the new `mouse.png`.
4.  **Modify `main.js` for new behavior:**
    *   Set `alarmSound.loop = true;` when the timer finishes.
    *   Ensure `stopTimer` pauses the alarm and resets its time.
    *   Store the initial timer duration (`lastSetTime`) and use it to reset the timer display after an alarm is stopped.
    *   Toggle the `.timer-running` class on the body when the timer starts and stops.
5.  **Firebase Integration:** Add Firebase server configuration.
