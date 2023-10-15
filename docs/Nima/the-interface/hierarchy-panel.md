# Hierarchy Panel

![[Pasted image 20231015032338.png]]

At the top of the Hierarchy Panel you can set the name of your file and toggle between Setup and Animate mode. Below that are all the stage objects, assets, controls, and animations (when in Animate mode) that make up your character.

## Hierarchy

The Hierarchy section is a tree view of all the items that are on the stage, arranged by their parent/child relationships. Read more about these relationships in the Core Concepts section.

Each row in the Hierarchy section represents an item on the stage. A circle button with an arrow appears next to items that have children nested under them. This button allows you to expand and collapse the list of children.

The icon next to then name identifies what type of object it is (image, bone, etc). Double click on a name to change it.

To change the parent/child relationships of objects you can either drag and drop, use the Change Parent button in the [Selection Panel](http://localhost:3000/learn/manual/interface/selection_panel), or use the Pick Child shortcut (described in the [Bone](http://localhost:3000/learn/manual/tools/bone) tool section).

>**Tip: Quickly Scroll to Items in the Hierarchy**
> 
Hover your mouse cursor over an item on the stage and press `**H**` to scroll the Hierarchy to this item. This is a quick way to navigate the Hierarchy, particularly in very large files.

## Draw Order

The Draw Order section displays only the images that are on your stage. These are organized by render depth. Drag and drop these images to change the order in which they are rendered. You can also animate the Draw Order when in Animate Mode.

## Assets

The Assets section displays a list of all the images you've imported. You can drag and drop these images onto the stage or onto the Hierarchy section to create as many instances of each image as you want. By re-using these images (creating instances) you can save on file size. For example, in our car scenario from earlier you could use just one image of a wheel for all the wheels of your car.

When you start a new file, the Assets section is empty. To add assets to the file, you can click the plus icon to select images from your hard-drive. A faster way to do this is by simply dragging and dropping images from your computer to the stage.

Even better, you can drag and drop PSD files directly to the stage (make sure you flatten any layer effects in Photoshop first). This approach ensures that all your layers' positions remain intact, as they get automatically placed on the stage for you.

##  Animations

The Animations list appears in Animate mode. This is a list of all the animations in your current file. By default you'll have one animation named Untitled. Click the plus icon to create a new animation. Double click on the text of any row to rename it.

In Animate mode there is always at least one animation selected; that is the animation that is active in the timeline. To make an animation active, select any of the rows in the Animations list. You can also preview any of the animations in this list by clicking the play button (regardless of whether the animation is currently selected). This allows you to play multiple animations at the same time, which can be helpful to ensure that your animations will blend properly in your game engine.

For example, you might create a walk animation for a character in your game. You might also create an attack animation. In your game, these animations may need to happen at the same time. Use the play buttons next to each animation to preview what your character will look while walking and attacking. The same attack animation might also need to work with an idle, run, or jump animation. Being able to play back multiple animations allows you to make sure that your attack animation works properly with all of these and that you don't have any conflicting keyframes that cause unexpected results.

##  Filtering

You can filter the entire contents of the Hierarchy Panel by pressing  **`CMD`** ﹢ **`F`** on Mac, or **`CTRL`** ﹢ **`F`** on PC.