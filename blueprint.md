# Timer Application Blueprint

## Overview

This is a timer application that allows users to set a time, start, stop, and reset the timer. It also includes preset time options for convenience.

## Features

*   **Timer Display:** Shows hours, minutes, and seconds. The time is editable.
*   **Distraction-Free Timer View:** When the timer is running, the screen shows only the timer numbers (enlarged) and the "Stop" button.
*   **Preset Times:** Buttons for 10s, 20s, 30s, 1m, 2m, 3m, 5m, and 10m.
*   **Controls:** Start, Stop, and Reset buttons.
*   **Web Components:** The timer will be built as a Web Component for encapsulation and reusability.
*   **Modern Design:** The application will have a clean and modern user interface.
*   **Sound Notification:** Plays a sound when the timer finishes, with a button to toggle sound on/off.
*   **Dark/Light Mode:** A button to switch between dark and light themes.
*   **Animation:** A line-art animation of a moving mouse is displayed while the timer is running.
*   **Responsive Design:** The layout is optimized for mobile devices.

## Current Plan

1.  **Update `blueprint.md`:** Reflect new UI and animation requirements.
2.  **Save `mouse.png`:** Find and save a suitable mouse image.
3.  **Update `style.css`:**
    *   Add a `.timer-running` class to the body to control visibility of elements.
    *   Hide non-essential elements and enlarge the timer display in the `.timer-running` state.
    *   Update the animation to use the new `mouse.png`.
4.  **Update `main.js`:**
    *   Toggle the `.timer-running` class on the body when the timer starts and stops.
5.  **Firebase Integration:** Add Firebase server configuration.
