# Timer Application Blueprint

## Overview

This is a timer application that allows users to set a time, start, stop, and reset the timer. It also includes preset time options for convenience.

## Features

*   **Timer Display:** Shows hours, minutes, and seconds. The time is editable.
*   **Preset Times:** Buttons for 10s, 20s, 30s, 1m, 2m, 3m, 5m, and 10m.
*   **Controls:** Start, Stop, and Reset buttons.
*   **Web Components:** The timer will be built as a Web Component for encapsulation and reusability.
*   **Modern Design:** The application will have a clean and modern user interface.
*   **Sound Notification:** Plays a sound when the timer finishes, with a button to toggle sound on/off.
*   **Dark/Light Mode:** A button to switch between dark and light themes.
*   **Animation:** A line-art animation of a running horse is displayed while the timer is running.
*   **Responsive Design:** The layout is optimized for mobile devices.

## Current Plan

1.  **Update `blueprint.md`:** Add the new features to the blueprint.
2.  **Sound:**
    *   Add an `<audio>` element and a sound on/off button to `index.html`.
    *   Modify `main.js` to play the sound and handle the on/off button.
3.  **Dark/Light Mode:**
    *   Add a theme-toggle button to `index.html`.
    *   Modify `style.css` to include a dark theme.
    *   Modify `main.js` to handle the theme-toggle.
4.  **Animation:**
    *   Add an SVG animation of a running horse to `index.html`.
    *   Modify `style.css` to style and position the animation.
    *   Modify `main.js` to show/hide the animation.
5.  **Responsive Design:**
    *   Modify `style.css` with media queries.
6.  **Firebase Integration:** Add Firebase server configuration.
