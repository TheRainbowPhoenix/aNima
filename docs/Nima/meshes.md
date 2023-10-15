# Meshes

Meshes are an excellent way to add natural and organic deformations to characters. Take a look at some of the shots posted to the site that use the [#Mesh](https://www.2dimensions.com/explore/tagged/mesh/) and [#VertexDeform](https://www.2dimensions.com/explore/tagged/vertexdeform/) features.

The Mesh section lives in the Selection Panel. Only images can be meshes, so be sure to select an image to see this section. Click on the switch next to this section to make an image into a mesh. This will enable some additional features, explained below.

For a tutorial on meshes, check out [this blog post](https://medium.com/2dimensions/how-to-use-meshes-in-nima-82306a9f88d).

##  Edit Mesh

Enter Edit Mesh mode to define the contour and subdivisions of your mesh. This mode will isolate the currently selected image from the rest of your character and reveal a different toolbar.

The Edit Mesh mode three primary functions:

-   Done (checkmark icon, use this or press ESC to exit the Edit Mesh mode)
-   Reset (restore your mesh to the default bounding box of your original image)
-   Auto Generate (experimental; automatically generates a contour)
-   Subdivide (create automatic subdivisions)

Note that the Auto Generate feature is experimental and may create more vertices than necessary. Use it as a starting point and keep in mind that it's easier to work with simpler meshes.

The Edit Mesh mode introduces 3 new tools:

-   Draw Mesh
-   Add Vertex/Edge
-   Remove Vertex/Edge

Use the Draw Mesh tool to create the contour of your mesh. Use the Add Vertex/Edge to add additional vertices to your contour, or to create subdivisions within your mesh. Click anywhere in your mesh to create a vertex, or click and drag from one vertex to another to create a forced edge. This can be useful when you want to make sure your mesh follows a particular shape or detail in your image.

## Vertex Deform

Enabling this switch allows you to deform your mesh by moving vertices. Exit Edit Mesh mode with Vertex Deform enabled and you'll notice that your vertices remain visible. You can now select a vertex and move it, deforming your mesh directly. You can keyframe this property in Animate Mode.

Use Vertex Deform by itself or combine it with bones to create layered animations.

##  Connect Bones

Another way to deform your mesh is by connecting bones to it. This will allow you to deform specific parts of your image with one bone, while other parts of the same image are controlled by other bones.

Click on the plus icon to connect bones. Select the bones you want to connect and press Done. Note that you can also double click on the bone names here to rename them.

## Edit Weights

Once bones have been connected to your mesh, you need to tell them how they should affect each vertex. This is done in the Edit Weights mode by painting on your mesh. Select a bone as your brush, and paint on the vertices. Tweak your brush properties to add/subtract the influence of each bone on your vertices.

Note that you can also switch your map to only show the selected bone. The Intensity value below this affects only the map preview on your screen. Crank this value up to make sure only the vertices you want are being affected.

Exit the Edit Weights mode and try rotating your bones to test how your weights are working. You may need to jump back into the Edit Weights mode to make a few tweaks before getting a smooth end result.

When you're happy with how your mesh is behaving, switch to Animate mode and keyframe your bones to test out some animations.