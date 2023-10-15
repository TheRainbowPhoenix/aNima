# Toolbar
The Toolbar is divided into a few primary sections: Transform Tools, Create Tools, and Stage Tools.

##  Transform Tools

![[Pasted image 20231015034400.png]]
Nima has four transform tools. These allow you to manipulate the transformation properties of objects on the stage.

-   [Translate](/nima/toolbar/translate) `**T**`
-   [Rotate](/nima/toolbar/rotate) `**R**`
-   [Scale](/nima/toolbar/scale) `**S**`
-   [IK Pose](/nima/toolbar/ik-pose) `**W**`

## Create Tools
![[Pasted image 20231015034425.png]]
Create Tools live in a flyout menu. They are only available in Setup mode, not Animate mode. Click the plus icon to open the flyout menu and select one of the tools to activate it.

Note that new objects generated with the Create Tools are always placed in the hierarchy based on the current selection. If an existing object (such as a bone or image) is currently selected, the new object will be created as a child of that selection. If nothing is selected the object will be created at the base level of the hierarchy. Use the deselect shortcut (Mac: **`CMD`** + **`D`**, PC: **`CTRL`** + **`D`**) if you want to make sure nothing is selected.

-   [Bone](/nima/toolbar/bone) `**B**`
-   [Node](/nima/toolbar/node) `**G**`
-   [Collider](/nima/toolbar/collider) `**Q**`
-   [Solo](/nima/toolbar/solo) `**Y**`
    
## Stage Tools
![[Pasted image 20231015034449.png]]
###  Selection Modes

![[Pasted image 20231015034502.png]]
The default selection mode in Nima is to allow everything to be selected. Switch to a different selection mode using the V shortcut to select only bones, images, or vertices.

###  Visibility Options
![[Pasted image 20231015034512.png]]

Toggle the visibility of images, bones, or colliders.

###  Axis Options
![[Pasted image 20231015034525.png]]

Choose whether to show transform handles on the stage in Local, Parent, or World space. Note that all properties in the selection panel are shown in Local space regardless of this setting.

###  Grid Options
![[Pasted image 20231015034536.png]]

Toggle the visibility of the Axis, Grid, and Rulers. To toggle the visibility of Rulers and Guides

###  Zoom
![[Pasted image 20231015034621.png]]

Click and drag on the input field to change zoom level, or enter a number with the keyboard.