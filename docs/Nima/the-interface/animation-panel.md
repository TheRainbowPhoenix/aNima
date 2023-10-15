# Animation Panel
![[Pasted image 20231015032928.png]]

The Animation Panel appears when you switch to Animate mode. It displays a timeline and playback controls/options for the currently selected animation (notice the currently selected animation in the Hierarchy Panel in the image above).

The timeline only displays objects and properties that have been keyed.

##  Animation Panel Header

The top of the Animation Panel shows playback controls on the left (Play/Pause, Back to Start) as well as the current position, frames per second, and duration of the timeline on the right.

##  Navigating the Timeline

Directly below the Animation Panel header, on top of the timeline, you'll see a scrollbar with two grabbers on each side. This control allows you to resize the zoom level of the timeline by manipulating the grabbers.

Alternatively, hold SPACEBAR and click and drag to pan in the timeline, just like on the Stage.

##  Setting Keys

Objects and their properties appear in the timeline once they have been keyed. To set a key, press the key button which appears in the Selection panel next to all properties that can be animated.

![[Pasted image 20231015032944.png]]

The key button has three states:

-   Not keyed
-   Changed (only if AutoKey is disabled)
-   Keyed
    

You can also key your current selection using the following shortcuts:

####  Key all transform properties (Translation, Rotation, Scale, and Length)

-   **`K`**
    

#### Key Translate

-   **`SHIFT`** ﹢ **`T`**
    

####  Key Rotation

-   **`SHIFT`** ﹢ **`R`**
    

#### Key Scale

-   **`SHIFT`** ﹢ **`S`**
    

####  Key Length

-   **`SHIFT`** ﹢ **`L`**
    

## Manipulating Keys

![[Pasted image 20231015033153.png]]

Keyed objects each appear on a single row of the timeline. Expand each object to reveal additional rows for each keyed property. The keys for each of these properties appear on the right hand side.
![[all_keys.gif]]

Note that the first row of the timeline is always the name of the current animation you are working on. The keys that appear on this row represent all the keys in the rest of the timeline below. Use these as a quick way to move all keys.
![[scale_keys.gif]]


#### Tip: Animation Resizing

> Change the duration of a portion of an animation by selecting a span of keyframes and holding **`ALT`**. Now grab a keyframe on the edge of your selection (yellow color) and drag to resize the selection. You can combine this with the "all keys" to resize your entire animation.

####  Tip: Key All Bones

> Sometimes you may want to key all the bones in your character. You can quickly do this by selecting a bone, pressing the Select All shortcut (Mac: `**CMD**` + `**A**`, PC: `**CTRL**` ﹢ `**A**`), and then using the Key Rotation shortcut above (`**SHIFT**` + `**R**`). Note that the Select All shortcut works for any currently selected object type (e.g. if you have an image selected, pressing Select All will select all images). If you have no objects selected, the shortcut will Select All objects.

####  Tip: Skip to Keys

> If no object is selected, use the Skip to Keys shortcut to jump to all keys. Otherwise the shortcut will jump to keys of the selected object.
>  - Skip Right: **<**
>  - Skip Left: **>**    

## Timeline Toggle Buttons

On the top left hand side, below the Animation Panel header, you'll find a number of buttons that toggle timeline functionality.

###  AutoKey

When AutoKey is active, changes made to any object's properties are automatically set as keys in the timeline at the current position of the scrub bar. The AutoKey function is enabled by default. When disabled, use the Set Keys method described above.

###  Show Selected

Enable this toggle button to view only the currently selected objects in the timeline.

###  Loop

When enabled, animations will loop back to the beginning when they reach the end.

###  Work Area

Enable this toggle to play back only a specific section of your animation. When Loop is enabled, playback will continuously loop in the Work Area.

###  Curve Editor

Enable this button to toggle between the regular timeline view and the Curve Editor view. The Curve Editor view shows a value graph of a selected property. You can select multiple properties to the left of the timeline and view multiple curves. Keys show up in this view along the X axis, just like in the timeline view. However, the keys are positioned up/down the Y axis based on their value. The line drawn from each key shows the in-between values of the animation. Change the shape of the line by manipulating the curve handles on the keys, without having to add extra keys. To view the handles, right click on a key and change its type. By default keys are linear (no handles), which simply draws a straight line from each key. Values decrease/increase constantly (or linearly) from one key to the next. To create a smoother animation, try the Easy Ease preset. This is generally a good starting point, but you'll want to tweak the handles yourself to get perfectly smooth motion.