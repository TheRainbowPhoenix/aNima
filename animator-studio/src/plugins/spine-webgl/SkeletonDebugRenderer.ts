/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated July 28, 2023. Replaces all prior versions.
 *
 * Copyright (c) 2013-2023, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software or
 * otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE
 * SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

import {
  Disposable,
  Color,
  SkeletonBounds,
  Utils,
  Skeleton,
  RegionAttachment,
  MeshAttachment,
  PathAttachment,
  ClippingAttachment,
} from "../spine-core";
import { ShapeRenderer } from "./ShapeRenderer.js";
import { VertexTransformer } from "./SkeletonRenderer";
import { ManagedWebGLRenderingContext } from "./WebGL.js";

export const DEBUG_BONES = 1;
export const DEBUG_REGION_ATTACHMENTS = 2;
export const DEBUG_BOUNDING_BOXES = 4;
export const DEBUG_MESH_HULL = 8;
export const DEBUG_MESH_TRIANGLES = 16;
export const DEBUG_PATHS = 32;
export const DEBUG_SKELETON_XY = 64;
export const DEBUG_CLIPPING = 128;

export class SkeletonDebugRenderer implements Disposable {
  boneLineColor = new Color(1, 0, 0, 1);
  boneOriginColor = new Color(0, 1, 0, 1);
  attachmentLineColor = new Color(0, 0, 1, 0.5);
  triangleLineColor = new Color(1, 0.64, 0, 0.5);
  pathColor = new Color().setFromString("FF7F00");
  clipColor = new Color(0.8, 0, 0, 2);
  aabbColor = new Color(0, 1, 0, 0.5);
  drawBones = true;
  drawRegionAttachments = true;
  drawBoundingBoxes = true;
  drawMeshHull = true;
  drawMeshTriangles = true;
  drawPaths = true;
  drawSkeletonXY = true;
  drawClipping = true;
  premultipliedAlpha = false;
  scale = 1;
  boneWidth = 2;

  private context: ManagedWebGLRenderingContext;
  private bounds = new SkeletonBounds();
  private temp = new Array<number>();
  private vertices = Utils.newFloatArray(2 * 1024);
  private static LIGHT_GRAY = new Color(192 / 255, 192 / 255, 192 / 255, 1);
  private static GREEN = new Color(0, 1, 0, 1);

  constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext) {
    this.context =
      context instanceof ManagedWebGLRenderingContext
        ? context
        : new ManagedWebGLRenderingContext(context);
  }

  draw(
    shapes: ShapeRenderer,
    skeleton: Skeleton,
    ignoredBones?: Array<string>,
    transformer: VertexTransformer | null = null,
    modelScale: number = 1,
    debug: number = 255
  ) {
    let skeletonX = skeleton.x;
    let skeletonY = skeleton.y;
    let gl = this.context.gl;
    let srcFunc = this.premultipliedAlpha ? gl.ONE : gl.SRC_ALPHA;
    shapes.setBlendMode(srcFunc, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let bones = skeleton.bones;
    if (debug & DEBUG_BONES) {
      shapes.setColor(this.boneLineColor);
      for (let i = 0, n = bones.length; i < n; i++) {
        let bone = bones[i];
        if (ignoredBones && ignoredBones.indexOf(bone.data.name) > -1) continue;
        if (!bone.parent) continue;

        // BEGIN: DEBUG

        let bx = bone.worldX;
        let by = bone.worldY;

        if (transformer) {
          // let position = [x, y];
          // transformer(position, position.length - 1, 1);
          // x = position[0];
          // y = position[1];

          let world = [bx, by];
          transformer(world, world.length - 1, 1);
          bx = world[0];
          by = world[1];
        }

        let x = bone.data.length * modelScale * bone.a + bx;
        let y = bone.data.length * modelScale * bone.c + by;

        // END: DEBUG

        shapes.rectLine(true, bx, by, x, y, this.boneWidth * this.scale);
      }
      if (debug & DEBUG_SKELETON_XY) {
        // BEGIN: DEBUG

        if (transformer) {
          let position = [skeletonX, skeletonY];
          transformer(position, position.length, 1);
          skeletonX = position[0];
          skeletonY = position[1];
        }

        // END: DEBUG

        shapes.x(skeletonX, skeletonY, 4 * this.scale);
      }
    }

    if (debug & DEBUG_REGION_ATTACHMENTS) {
      shapes.setColor(this.attachmentLineColor);
      let slots = skeleton.slots;
      for (let i = 0, n = slots.length; i < n; i++) {
        let slot = slots[i];
        let attachment = slot.getAttachment();
        if (attachment instanceof RegionAttachment) {
          let regionAttachment = <RegionAttachment>attachment;
          let vertices = this.vertices;

          regionAttachment.computeWorldVertices(slot, vertices, 0, 2);

          if (transformer) transformer(vertices, vertices.length, 2);

          shapes.line(vertices[0], vertices[1], vertices[2], vertices[3]);
          shapes.line(vertices[2], vertices[3], vertices[4], vertices[5]);
          shapes.line(vertices[4], vertices[5], vertices[6], vertices[7]);
          shapes.line(vertices[6], vertices[7], vertices[0], vertices[1]);
        }
      }
    }

    if (debug & DEBUG_MESH_HULL || debug & DEBUG_MESH_TRIANGLES) {
      let slots = skeleton.slots;
      for (let i = 0, n = slots.length; i < n; i++) {
        let slot = slots[i];
        if (!slot.bone.active) continue;
        let attachment = slot.getAttachment();
        if (!(attachment instanceof MeshAttachment)) continue;
        let mesh = <MeshAttachment>attachment;
        let vertices = this.vertices;
        mesh.computeWorldVertices(
          slot,
          0,
          mesh.worldVerticesLength,
          vertices,
          0,
          2
        );

        if (transformer) transformer(vertices, vertices.length, 2); // Apply transformation

        let triangles = mesh.triangles;
        let hullLength = mesh.hullLength;
        if (debug & DEBUG_MESH_TRIANGLES) {
          shapes.setColor(this.triangleLineColor);
          for (let ii = 0, nn = triangles.length; ii < nn; ii += 3) {
            let v1 = triangles[ii] * 2,
              v2 = triangles[ii + 1] * 2,
              v3 = triangles[ii + 2] * 2;
            shapes.triangle(
              false,
              vertices[v1],
              vertices[v1 + 1], //
              vertices[v2],
              vertices[v2 + 1], //
              vertices[v3],
              vertices[v3 + 1] //
            );
          }
        }
        if (debug & DEBUG_MESH_HULL && hullLength > 0) {
          shapes.setColor(this.attachmentLineColor);
          hullLength = (hullLength >> 1) * 2;
          let lastX = vertices[hullLength - 2],
            lastY = vertices[hullLength - 1];
          for (let ii = 0, nn = hullLength; ii < nn; ii += 2) {
            let x = vertices[ii],
              y = vertices[ii + 1];
            shapes.line(x, y, lastX, lastY);
            lastX = x;
            lastY = y;
          }
        }
      }
    }

    if (debug & DEBUG_BOUNDING_BOXES) {
      let bounds = this.bounds;
      bounds.update(skeleton, true);
      shapes.setColor(this.aabbColor);

      // BEGIN: DEBUG
      let minX = bounds.minX,
        minY = bounds.minY;

      if (transformer) {
        let vertices = [minX, minY];
        transformer(vertices, vertices.length - 1, 1);
        minX = vertices[0];
        minY = vertices[1];
      }
      // END: DEBUG

      shapes.rect(
        false,
        minX,
        minY,
        bounds.getWidth() * modelScale,
        bounds.getHeight() * modelScale
      );
      let polygons = bounds.polygons;
      let boxes = bounds.boundingBoxes;
      for (let i = 0, n = polygons.length; i < n; i++) {
        let polygon = polygons[i];
        shapes.setColor(boxes[i].color);
        // BEGIN: DEBUG

        if (transformer) transformer(polygon, polygon.length, 2);
        let closedPolygon = new Float32Array(polygon.length + 2);
        closedPolygon.set(polygon);

        closedPolygon[closedPolygon.length - 2] = polygon[0]; // x1
        closedPolygon[closedPolygon.length - 1] = polygon[1]; // y1

        // TODO: transform ?
        // END: DEBUG
        shapes.polygon(closedPolygon, 0, closedPolygon.length);
      }
    }

    if (debug & DEBUG_PATHS) {
      let slots = skeleton.slots;
      for (let i = 0, n = slots.length; i < n; i++) {
        let slot = slots[i];
        if (!slot.bone.active) continue;
        let attachment = slot.getAttachment();
        if (!(attachment instanceof PathAttachment)) continue;
        let path = <PathAttachment>attachment;
        let nn = path.worldVerticesLength;
        let world = (this.temp = Utils.setArraySize(this.temp, nn, 0));

        if (transformer) transformer(world, world.length, 2);

        path.computeWorldVertices(slot, 0, nn, world, 0, 2);
        let color = this.pathColor;
        let x1 = world[2],
          y1 = world[3],
          x2 = 0,
          y2 = 0;
        if (path.closed) {
          shapes.setColor(color);
          let cx1 = world[0],
            cy1 = world[1],
            cx2 = world[nn - 2],
            cy2 = world[nn - 1];
          x2 = world[nn - 4];
          y2 = world[nn - 3];
          shapes.curve(x1, y1, cx1, cy1, cx2, cy2, x2, y2, 32);
          shapes.setColor(SkeletonDebugRenderer.LIGHT_GRAY);
          shapes.line(x1, y1, cx1, cy1);
          shapes.line(x2, y2, cx2, cy2);
        }
        nn -= 4;
        for (let ii = 4; ii < nn; ii += 6) {
          let cx1 = world[ii],
            cy1 = world[ii + 1],
            cx2 = world[ii + 2],
            cy2 = world[ii + 3];
          x2 = world[ii + 4];
          y2 = world[ii + 5];
          shapes.setColor(color);
          shapes.curve(x1, y1, cx1, cy1, cx2, cy2, x2, y2, 32);
          shapes.setColor(SkeletonDebugRenderer.LIGHT_GRAY);
          shapes.line(x1, y1, cx1, cy1);
          shapes.line(x2, y2, cx2, cy2);
          x1 = x2;
          y1 = y2;
        }
      }
    }

    if (debug & DEBUG_BONES) {
      shapes.setColor(this.boneOriginColor);
      for (let i = 0, n = bones.length; i < n; i++) {
        let bone = bones[i];
        if (ignoredBones && ignoredBones.indexOf(bone.data.name) > -1) continue;

        // BEGIN: DEBUG

        let x = bone.worldX,
          y = bone.worldY;

        if (transformer) {
          let position = [x, y];
          transformer(position, 1, 1);
          bone.worldX = position[0];
          bone.worldY = position[1];
        }

        // END: DEBUG

        shapes.circle(
          true,
          bone.worldX,
          bone.worldY,
          3 * this.scale,
          this.boneOriginColor,
          8
        );
      }
    }

    if (debug & DEBUG_CLIPPING) {
      let slots = skeleton.slots;
      shapes.setColor(this.clipColor);
      for (let i = 0, n = slots.length; i < n; i++) {
        let slot = slots[i];
        if (!slot.bone.active) continue;
        let attachment = slot.getAttachment();
        if (!(attachment instanceof ClippingAttachment)) continue;
        let clip = <ClippingAttachment>attachment;
        let nn = clip.worldVerticesLength;
        let world = (this.temp = Utils.setArraySize(this.temp, nn, 0));
        clip.computeWorldVertices(slot, 0, nn, world, 0, 2);
        for (let i = 0, n = world.length; i < n; i += 2) {
          let x = world[i];
          let y = world[i + 1];
          let x2 = world[(i + 2) % world.length];
          let y2 = world[(i + 3) % world.length];
          shapes.line(x, y, x2, y2);
        }
      }
    }
  }

  dispose() {}
}
