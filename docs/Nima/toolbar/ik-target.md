# IK Target

##### Note: This section needs to be updated to reflect the new Constraints system. IK Targets have been deprecated in favor of this new system. For more information, and if you still need to access the old system, please read [here](https://medium.com/2dimensions/nima-ik-changes-the-new-ik-constraint-88e36592e60a).

Most skeletal animation in Nima is done by rotating the angles of bones. The position of a child bone changes according to the rotation of its parent. This means that positioning a bone at the end of a chain often requires you to rotate multiple bones above it to reach the desired pose. This type of skeletal posing is called Forward Kinematics.

Inverse Kinematics, on the other hand, allows you to work from the opposite point off view. You create a target to tell the final bone where it should point, and the IK system works backwards to find a valid orientation for the parent bones above it.

There are many applications for this technique, but some of the more common examples include making a character point at an item, or to make sure a character's feet stay perfectly planted on the ground.

For example, imagine trying to animate a character's idle pose, with their body moving slightly up and down with each breath. You'd start by animating a root bone (perhaps the pelvis) up and down to create the appearance of breathing. However, this animation would also cause the legs to move up and down. You would need to add more keys to the leg bones to make sure the feet still line up with the ground throughout the entire animation.

A much faster and more powerful technique would be to add an IK Target for each foot. Now when the root bone moves up and down, the legs will automatically orient themselves so the feet remain perfectly floored. From an animation standpoint, this is a far simpler technique as only one bone is being keyed, making it a lot easier for you to iterate and focus on the final outcome.

For more examples, take a look at some of the shots posted to the site that use [#IK](https://www.2dimensions.com/shots/tagged/ik).

## Create IK Target
![[create_ik.png]]

Start by pressing `**X**` to activate the Create IK Target tool. Click on the stage to create an IK Target. Be mindful of your current selection when doing this; the new IK Target will be created as a child of your current selection.

With the IK Target selected, click on Influenced Bones in the Selection Panel. Use this to pick which bones you want to be affected by the IK Target.

Move the IK Target to test how the IK system is working. If necessary, enable the Invert Direction switch in the Selection Panel to invert the angle of the chain.

