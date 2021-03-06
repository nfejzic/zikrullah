# Changelog

## Commit on 18.09.2019:

1. Created Icon / Favicon, edited manifest.json to use the new icon.
2. Cleaned up esmaul-husna.json file.
3. Design improvements, better color theming. Using background image.

## Commit on 15.09.2019:

1. Added functionality to go backwards.
2. Changed handling of animation of text under the SVG. Using much better approach now. Previous version used index % 2 to figure out which text to show and swap two different ellements depending on whether index was odd or even. That caused nightmare when trying to go backwards, or by overflow of array ( going from 98 to 0, both are even so it doesn't swap them and animate transition ). Now animating on index change, which is a lot cleaner way.
3. Exported morph and morph helper code into separate file, will try to release this as a little helper npm module.

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
