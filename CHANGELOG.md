# Changelog

## Commit on 20.08.2019 - Following changes are made:

1. Fixed animations on text under SVG.
2. Fixed animation when going back to the first SVG element in array. Was not cloning the SVG object when appending to the "container". That modified the actual SVG element in the svgData array, which made it impossible to animate to itself.
3. Implemented more destructuring, and safer way of modifying paths of SVGs.

## Commit on 16.08.2019 - Following changes are made:

1. Now using function based React Components with React Hooks
2. New custom React Component -> NameSwapper - used for animation and display of name and meaning under animation
3. Using modified SVGs - used Knife tool in Adobe Illustrator to make cuts on every hole in SVG files. This way the holes are not filled during the animation, but animated, like it should be
4. Removed stroke style for animated SVG...

## Commit on 16.07.2019 - Following changes were made:

1. this.inAnimation boolean variable exists. It return true if SVG is currently in animation, false otherwise
2. this.inAnimation is used to prevent user from clicking during animation. Clicks are cancelled.
3. SVG style is now changed to outline while under animation, and to fill when animation finishes.
4. Setting initial SVG element in getSVG method. This is a must, so that the initial SVG is set AFTER loading at least the first SVG.
5. Added this.started boolean. This is used for setting initial SVG, so that the SVG is set only once, not 99 times as the SVGs load.

This is made possible by using just animate timelines 'on' function. timeline.on("finish", () => ...).
