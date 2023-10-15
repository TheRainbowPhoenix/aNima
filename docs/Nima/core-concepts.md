# Nima Core Concepts

At its most basic level, Nima is a 2D animation program. It allows you to place objects on the stage and animate their properties (e.g. position, scale, rotation).

## Hierarchy

All the objects that you place on the stage appear in the Hierarchy. The Hierarchy is a tree view, which shows the parent/child relationships between the items on the stage. These parent/child relationships are a core concept in Nima, which allow you to create complex layered animations with minimal effort. Any type of object can be a parent or a child of another type of object. When an object is a child of another object, it inherits all the transformations of its parent.

As a simple example, consider a car. We might have an image for the car body and an image for each wheel. We can make the wheels children of the car body.

![[Pasted image 20231015031518.png]]

Now if we want the car to move, we just have to animate one property: the translation of the car body. The wheels will automatically follow. We can also animate the rotation property of each wheel, and the wheels will rotate on their own axes, while still moving with the body of the car.

![[Pasted image 20231015031527.png]]

The depth of these parent/child relationships is infinite, so you can keep stacking (or nesting) items to create grandchildren, great-grandchildren, and so on.

## Assets
In the example above, you'll notice there are 2 wheel images in the Hierarchy. In the Assets folder, however, there's only one image for the wheels.

![[Pasted image 20231015031728.png]]

Nima allows you to place on the stage as many instances of an asset as you want, and your file size stays small because you're only storing the data for one image. This also allows you to change the image at a later date, and all the instances in your character will automatically update.

Read more on the [Assets](/nima/assets) page.

##  Bones

You could use the basic concept of the Hierarchy and parent/child relationships explained in the section above to animate your character entirely by using images. In some cases, like the car example, this might make sense. For more advanced characters, however, this might be cumbersome.

Bones offer a more intuitive way to animate advanced characters with many connected parts. They follow the same hierarchical concepts discussed above, but they allow you to easily create a unique transform space (or pivot point) for your images while also keeping a consistent distance between parts (just like a real skeleton).

Read more on the Bone tool page.

## Setup & Animate Mode

![[Pasted image 20231015031800.png]]

There are two primary modes in Nima: Setup and Animate. As the names imply, you want to setup your character in Setup mode and animate your character in Animate mode. Note that the interface changes to display the appropriate tools for each mode. For example, the Animations list appears in the Hierarchy Panel in Animate mode. Similarly, the Create Tools are only available in the Toolbar in Setup mode.