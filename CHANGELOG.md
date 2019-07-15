# Changelog

## Commit on 16.07.2019 - Following changes were made:

1. this.inAnimation boolean variable exists. It return true if SVG is currently in animation, false otherwise
2. this.inAnimation is used to prevent user from clicking during animation. Clicks are cancelled.
3. SVG style is now changed to outline while under animation, and to fill when animation finishes.

This is made possible by using just animate timelines 'on' function. timeline.on("finish", () => ...).
