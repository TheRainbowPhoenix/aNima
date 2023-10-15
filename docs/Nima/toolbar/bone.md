# Bone Tool
![[create_bone2.png]]

Bones allow you to create a skeleton for your characters. This is an intuitive and natural way to animate multiple connected parts of a character (like an arm or a leg).

##  Creating Bones

To create a chain of bones, select the Create Bone `**B**` tool then click on the stage.

![[create_bone_chain.gif]]

The first click will create a root bone, which is the start of a chain. Every subsequent click will create a new bone in the chain. Note that every new bone is a child of the previous bone, with the chain getting one step deeper with each click (in the Hierarchy). This happens automatically because the Create Bone tool automatically selects the joint of the previously created bone.

![[create_bone_branch.gif]]

To continue the chain from a different bone, first select that bone then continue using the Create Bone tool from there. Note that you can select either the joint or bone.

To create a new root bone when you have another bone selected, hold `**ALT**`.

## Joints

Joints don't exist in the Hierarchy. They are controls to help setup and orient bones. When a joint is translated, the length and rotation of nearby bones are being changed. For this reason, we recommend translating joints only in Setup mode and not in Animate mode (unless you are intentionally trying to change the length of your bones). Also, note that translating bones (using the Translate tool) has a similar effect: it changes the length and rotation of nearby bones. This is because bones don't actually have X and Y coordinates, but are defined by their length and rotation relative to their parent.

## Root Bones

Root bones, on the other hand, do have X and Y properties and can be both translated and rotated. Root bones are automatically created when you use the Create Bone tool at the top of the Hierarchy (with nothing selected). You can also create a new root bone by holding `**ALT**`, even if you have another bone selected. Instead of creating a regular bone, this will create a root bone as a child of the current selection.
![[create_root_bone.gif]]

This is a quick way to create a new transform space for a chain, which can be keyed in both translation and rotation. It's also a way to keep your skeleton simpler, only creating bones at the locations that will require animation.

##  Pick Children

The Pick Children shortcut can be used to quickly attach images to bones while using the Create Bone tool.

![[select_children.gif]]

To begin, start creating a skeleton with the Create Bone tool. With the first bone created, press `**C**` to activate the Pick Children mode. Select the image you want to connect to your new bone and press `**C**` again to close the mode. Nima parents the image you selected to your new bone and sets the name of the bone to the name of the image. You can also select multiple images, in this case Nima will name your bone after the first image selected.

Notice that after closing the Pick Children mode, Nima automatically re-selects the Create Bone tool and the last bone you had created in the chain. This way you can keep creating your skeleton from where you had left off.