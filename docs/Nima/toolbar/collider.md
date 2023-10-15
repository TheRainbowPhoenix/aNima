# Collider Tool
![[create_collider.png]]

A Collider is an object that defines a hit area that triggers a collision event in your game. For example, you might create a Collider on a character's sword and another collider on an enemy's torso. You can then tell your game engine to subtract hit points from the enemy whenever the two objects collide.

![[collider_create.gif]]

You can find the Create Colliders tool under the Create Tools flyout menu (or use the keyboard shortcut `**Q**`).

![[collider_shapes.gif]]

Once you've created a Collider, you can change its properties in the Selection Panel under Collider Options. Choose Polygon under the shape dropdown to create a custom shape.

![[collider_disable.gif]]

One particularly useful property of Colliders is that you can animate their Enabled state (true or false). If your character has a lightsaber, you'd want to make sure your collider is enabled only when the lightsaber is turned on. If your character has equipped a shield, you might want the shield's collider to be disabled during a rest/idle pose, but enabled when holding a guard/shield pose.
