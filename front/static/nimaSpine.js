class SpineExporter {
  /**
   * Represents the state object.
   * @typedef State
   * @property {boolean} isExporting - Indicates whether export is in progress.
   * @property {?number} maxImageWidth - The maximum width for images.
   * @property {?number} maxImageHeight - The maximum height for images.
   * @property {boolean} linkImageSize - Indicates whether image size is linked.
   * @property {boolean} linkAtlasSize - Indicates whether atlas size is linked.
   * @property {number} maxAtlasWidth - The maximum width for the atlas.
   * @property {number} maxAtlasHeight - The maximum height for the atlas.
   * @property {boolean} atlasPowerOfTwo - Indicates whether atlas size is a power of two.
   * @property {boolean} atlasSquare - Indicates whether atlas is square.
   * @property {boolean} cropImages - Indicates whether images are cropped.
   * @property {boolean} maxKeyFrameTimeIsDuration - Indicates whether maximum keyframe time is considered as duration.
   * @property {number} padding - The padding value.
   * @property {boolean} isModalOpen - Indicates whether a modal is open.
   * @property {boolean} isModalClosing - Indicates whether a modal is closing.
   * @property {Engine[]} engines - The list of export engines.
   * @property {number} selectedEngineIndex - The index of the selected export engine.
   * @property {string} selectedExportFormat - The selected export format.
   */

  /**
   * Represents an export engine.
   * @typedef Engine
   * @property {string} label - The label of the engine.
   * @property {string} [extension] - The extension for the export format.
   * @property {string} [tutorial] - The tutorial link for the engine.
   * @property {boolean} [multiplyAlpha] - Indicates whether alpha should be multiplied.
   * @property {boolean} [isZip] - Indicates whether export format is a ZIP file.
   */

  /**
   * Represents the Nima Actor object.
   * @typedef Actor
   * @property {AnimationFolder} animationFolder - The animation folder of the actor.
   * @property {NimaEventsMap} events - The events associated with the actor.
   * @property {boolean} isNameReadOnly - Indicates whether the name of the actor is read-only.
   * @property {string} name - The name of the actor.
   * @property {any[]} removeLater - Array of items to be removed later.
   * @property {NimaAnimation[]} animations - Array of items to be removed later.
   * @property {Actor[]} hierarchyChildren - The children actors in the hierarchy.
   * @property {ActorRoot} root - Actor root
   */

  /**
   * @typedef {Object} NimaNode
   * @property {NimaEventsMap} events
   * @property {number} treeIndex
   * @property {Actor} actor
   * @property {Set<any>} allConstraints
   * @property {boolean} allowDragDrop
   * @property {NimaNode[]} children
   * @property {NimaNode} firstChild
   * @property {number} frameOpacity
   * @property {number} frameOpacityKS
   * @property {number} framePosX
   * @property {number} framePosXKS
   * @property {number} framePosXParent
   * @property {number} framePosXWorld
   * @property {number} framePosY
   * @property {number} framePosYKS
   * @property {number} framePosYParent
   * @property {number} framePosYWorld
   * @property {number} frameRotation
   * @property {number} frameRotationKS
   * @property {number} frameScaleX
   * @property {number} frameScaleXKS
   * @property {number} frameScaleY
   * @property {number} frameScaleYKS
   * @property {boolean} hasChildren
   * @property {boolean} isConstrained
   * @property {boolean} isLocked
   * @property {boolean} isNode
   * @property {boolean} isRemoved
   * @property {boolean} isVisible
   * @property {NimaNode} lastChild
   * @property {string} name
   * @property {number} opacity
   * @property {NimaNode} parent
   * @property {Vec3} rawTransform
   * @property {Vec3} rawWorldTransform
   * @property {number} refId
   * @property {boolean} renderCollapsed
   * @property {number} renderOpacity
   * @property {number} rigOpacity
   * @property {number} rigPosX
   * @property {number} rigPosY
   * @property {number} rigRotation
   * @property {Point} rigScale
   * @property {number} rigScaleX
   * @property {number} rigScaleY
   * @property {Point} rigTranslation
   * @property {number} rotation
   * @property {Point} scale
   * @property {any} stageItem // TODO
   * @property {Vec3} transform
   * @property {Point} translation
   * @property {number} treeDepth
   * @property {number} treeOrder
   * @property {number} treeOrderFactor
   * @property {string} typeName
   * @property {string} uiHierIconClass
   * @property {string} uiIcon
   * @property {string} uiSelectionIconClass
   * @property {boolean} useAnimationValues
   * @property {any} visibilityItem
   * @property {Vec3} worldTransform
   * @property {Point} worldTranslation
   */

  /**
   * Represents methods of the ActorRoot object.
   * @typedef {Object} ActorRoot
   * @property {NimaNode[]} children
   * @property {Function} restSiblingIndices - Sets the sibling indices for all children.
   * @property {Function} silentlySetChildren - Sets children without triggering notifications.
   * @property {Function} notifyChildrenChanged - Notifies when children have changed.
   * @property {Function} onChildrenChanged - Callback when children have changed.
   * @property {Function} add - Adds a child to the actor.
   * @property {Function} remove - Removes a child from the actor.
   * @property {Function} eachChild - Executes a callback for each child.
   * @property {EachChildRecursive} eachChildRecursive - Executes a callback for each child recursively.
   * @property {Function} all - Executes a callback for all children.
   * @property {Function} serializeProperties - Serializes properties of the actor.
   * @property {Function} serializeInteractive - Serializes interactive properties of the actor.
   * @property {Function} serialize - Serializes the actor.
   */

  /**
   * Represents an object with a filter method.
   * @typedef {function((value: NimaNode) => any?): NimaNode[]} EachChildRecursive
   */

  /**
   * Represents an animation folder.
   * @typedef AnimationFolder
   * @property {NimaEventsMap} events - The events associated with the animation folder.
   * @property {Actor} actor - The actor associated with the animation folder.
   * @property {boolean} autoKey - Indicates whether auto-keying is enabled.
   * @property {boolean} disableVisibilityToggle - Indicates whether visibility toggle is disabled.
   * @property {number} displayEnd - The end of the display.
   * @property {number} displayStart - The start of the display.
   * @property {number} duration - The duration of the animation.
   * @property {NimaAnimation[]} editableKeyedNodes - Array of editable keyed nodes.
   * @property {number} fps - The frames per second of the animation.
   * @property {boolean} loop - Indicates whether the animation loops.
   * @property {string} name - The name of the animation folder.
   * @property {number} order - The order of the animation folder.
   */

  /**
   * Represents an event.
   * @typedef NimaAnimation
   * @property {NimaEventsMap} events - The events associated with the event.
   * @property {Actor} actor - The actor associated with the event.
   * @property {boolean} autoKey - Indicates whether auto-keying is enabled.
   * @property {boolean} disableVisibilityToggle - Indicates whether visibility toggle is disabled.
   * @property {number} displayEnd - The end of the display.
   * @property {number} displayStart - The start of the display.
   * @property {number} duration - The duration of the event.
   * @property {number} fps - The frames per second of the event.
   * @property {boolean} loop - Indicates whether the event loops.
   * @property {string} name - The name of the event.
   * @property {boolean} isActive
   * @property {NimaAnimation[]} keyedNodes
   * @property {number} order - The order of the event.
   */

  /**
   * Represents the Nima object.
   * @typedef Nima
   * @property {Actor} actor - The WebGL context.
   * @property {Object} events - The events associated with Nima.
   * @property {Array<any>} removeLater - Array of items to be removed later.
   * @property {?any} hold - Placeholder for some data.
   * @property {string} _BuildNumber - The build number of Nima.
   * @property {Graphics} _Graphics - The graphics settings of Nima.
   */

  /**
   * Represents the graphics settings of Nima.
   * @typedef Graphics
   * @property {Object} gl - The WebGL context.
   * @property {ProjectionMatrix} projection - The projection matrix.
   * @property {number} viewportWidth - The width of the viewport.
   * @property {number} viewportHeight - The height of the viewport.
   * @property {boolean} isLoading - Indicates whether Nima is currently loading.
   * @property {number} loadProgress - The loading progress of Nima.
   * @property {?Error} loadError - Any error that occurred during loading.
   */

  /**
   * Point
   * @typedef {[number,number]} Point
   */

  /**
   * Vec3
   * @typedef {[number,number,number, number,number,number]} Vec3
   */

  /**
   * Represents the projection matrix.
   * @typedef {[number,number,number,number,
   * number,number,number,number,
   * number,number,number,number,
   * number,number,number,number]} ProjectionMatrix
   */

  /**
   * Represents the projection matrix.
   * @typedef {Map<string, (() => void)[]>} NimaEventsMap
   */

  /**
   * Creates an instance of SpineExporter.
   * @param {Nima} nima - The Nima object.
   * @param {State} state - The state of the SpineExporter.
   */
  constructor(nima, state) {
    /** @type {Nima} nima */
    this.nima = nima;
    /** @type {State} state */
    this.state = state;
  }

  /**
   *
   * @param {Actor} actor
   * @param {*} callback
   */
  export(actor, callback) {
    const assets = [];
    const assetMap = new Map();
    const assetData = [];
    this.assetLookup = {};

    actor.root.eachChildRecursive(function (childNode) {
      switch (childNode.constructor.registeredActorName) {
        case "image":
          if (childNode.isVisible && childNode.asset) {
            assetMap.set(childNode, assets.length);
            assets.push(childNode);
            // TODO
            // if (childNode.asset instanceof AssetGroup) {
            //   for (let i = 0; i < childNode.asset.children.length; i++) {
            //     const subAsset = childNode.asset.children[i];
            //     self.addExportAsset(subAsset, childNode);
            //   }
            // } else if (childNode.bitmap) {
            //   self.addExportAsset(childNode.asset, childNode);
            // }
          }
          break;
        case "collider":
        case "customProperty":
        case "event":
        case "jelly":
        case "jellyBone":
        case "bone":
        case "rootBone":
        case "node":
        case "solo":
        case "ikConstraint":
        case "distanceContraint":
        case "translationConstraint":
        case "scaleConstraint":
        case "stageConstraint":
        case "transformConstraint":
          assetMap.set(childNode, assets.length);
          assets.push(childNode);
          break;
      }
    });

    const croppedImages = [];
    for (let i = 0; i < assetData.length; i++) {
      const asset = assetData[i];
      const imageData = {
        bytes: asset.bitmap.bytes,
        width: asset.bitmap.width,
        height: asset.bitmap.height,
        channels: asset.bitmap.channels,
      };
      let minU = 1,
        minV = 1,
        maxU = 0,
        maxV = 0;
      if (configOptions.cropImages) {
        for (let j = 0; j < asset.meshes.length; j++) {
          const vertices = asset.meshes[j].verts;
          const vertCount = vertices.length / 4;
          let vertIndex = 0;
          for (let k = 0; k < vertCount; k++) {
            const u = vertices[vertIndex + 2];
            const v = vertices[vertIndex + 3];
            vertIndex += 4;
            minU = Math.min(minU, u);
            maxU = Math.max(maxU, u);
            minV = Math.min(minV, v);
            maxV = Math.max(maxV, v);
          }
        }
      }
      imageData.minU = minU !== 1 ? minU : 0;
      imageData.minV = minV !== 1 ? minV : 0;
      imageData.maxU = maxU !== 0 ? maxU : 1;
      imageData.maxV = maxV !== 0 ? maxV : 1;
      croppedImages.push(imageData);
    }

    console.log(this.nima);

    setTimeout(() => {
      if (!actor) {
        callback(new Error("Invalid actor provided"));
      } else {
        const exportedData = {
          actorName: actor.name,
          animationCount: actor.animations.length,
        };
        callback(null, exportedData);
      }
    }, 1000);
  }
}
