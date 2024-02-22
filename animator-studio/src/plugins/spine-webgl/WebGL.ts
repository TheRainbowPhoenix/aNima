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

import { Restorable, BlendMode } from "../spine-core";

export class ManagedWebGLRenderingContext {
  public canvas: HTMLCanvasElement | OffscreenCanvas;
  public gl: WebGLRenderingContext;
  private restorables = new Array<Restorable>();

  constructor(
    canvasOrContext: HTMLCanvasElement | WebGLRenderingContext,
    contextConfig: any = { alpha: "true" }
  ) {
    if (
      !(
        canvasOrContext instanceof WebGLRenderingContext ||
        (typeof WebGL2RenderingContext !== "undefined" &&
          canvasOrContext instanceof WebGL2RenderingContext)
      )
    ) {
      let canvas: HTMLCanvasElement = canvasOrContext;
      this.gl = <WebGLRenderingContext>(
        (canvas.getContext("webgl2", contextConfig) ||
          canvas.getContext("webgl", contextConfig))
      );
      this.canvas = canvas;
      canvas.addEventListener("webglcontextlost", (e: any) => {
        let event = <WebGLContextEvent>e;
        if (e) e.preventDefault();
      });
      canvas.addEventListener("webglcontextrestored", (e: any) => {
        for (let i = 0, n = this.restorables.length; i < n; i++)
          this.restorables[i].restore();
      });
    } else {
      this.gl = canvasOrContext;
      this.canvas = this.gl.canvas;
    }
  }

  addRestorable(restorable: Restorable) {
    this.restorables.push(restorable);
  }

  removeRestorable(restorable: Restorable) {
    let index = this.restorables.indexOf(restorable);
    if (index > -1) this.restorables.splice(index, 1);
  }
}
