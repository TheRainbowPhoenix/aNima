import Graphics from "$lib/runtime/Graphics";
import { TextureFilteringFlags } from "$lib/nima/common";
import { mat2d, mat4, vec2, vec4 } from "gl-matrix";
import { applyMixins } from "$lib/helpers/objs";
import { ThickLineShaders } from "./thickLine";
import { WireframeShaders } from "./wireframe";

export type GraphicsTexture = WebGLTexture & {
  flags: number;
  isLoaded: boolean;
  width: number;
  height: number;
};

class GraphicsManager {
  private gl: WebGLRenderingContext;
  private shaders: { [name: string]: WebGLShader } = {};
  private programs: { [name: string]: WebGLProgram } = {};
  private numResourcesToLoad = 0;
  private numResourcesLoaded = 0;
  private loadStartTime = Date.now();
  private projectionMatrix = mat4.create();
  private viewportWidth = 0;
  private viewportHeight = 0;
  private clearColor: vec4 = [1, 1, 1, 1]; // O
  private clearColorFloat32 = new Float32Array(this.clearColor); // S
  private projectionMatrixTmp = mat4.create(); // k
  private worldMatrixTmp = mat4.create(); // P
  private buffer: WebGLBuffer;
  private defaultModelViewMatrix: mat4;
  private projection: mat4;

  private canvas: HTMLCanvasElement;

  private thickLine: ThickLineShaders;
  private wireframe: any;

  constructor(canvasElem: HTMLCanvasElement) {
    this.canvas = canvasElem;

    const contextAttributes: WebGLContextAttributes = {
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    };

    let gl =
      canvasElem.getContext("webgl", contextAttributes) ||
      (canvasElem.getContext(
        "experimental-webgl",
        contextAttributes
      ) as WebGLRenderingContext);

    if (!gl) {
      throw new Error("Failed to initialize WebGL context");
    } else {
      this.gl = gl;
    }

    this.gl.getExtension("OES_standard_derivatives");

    this.thickLine = new ThickLineShaders(gl); // new o.default(gl),
    this.wireframe = new WireframeShaders(gl); // new a.default(gl),

    this.projection = mat4.create();
    this.defaultModelViewMatrix = mat4.create();

    let buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create WebGL Buffer");
    }
    this.buffer = buffer;

    var tintColor = new Float32Array([1, 1, 1, 1]);
    var worldMatrix = mat4.create();
    var viewMatrix = mat4.create();

    this.initializeShaders();
  }

  addResourceToLoad() {
    this.numResourcesToLoad++;
  }

  advanceProgress(e: number) {
    var now = Date.now();
    var i = now - this.loadStartTime;

    this.loadStartTime = now;
    // this.loadError = e;
    // if (_this.advanceProgress) {
    //   _this.advanceProgress.call(
    //     this,
    //     this.numResourcesLoaded / this.numResourcesToLoad,
    //     i
    //   );
    // }
  }

  initializeShader(s: any) {}

  initializeShaders() {
    // this.pieShader = this.g.initializeShader({
    //           name: "PieShader",
    //           vertex: "Pie.vs",
    //           fragment: "Pie.fs",
    //           attributes: {
    //             Position: {
    //               name: "Position",
    //               size: 2,
    //               stride: 36,
    //               offset: 0,
    //             },
    //             Color: {
    //               name: "Color",
    //               size: 4,
    //               stride: 36,
    //               offset: 8,
    //             },
    //             Rotation: {
    //               name: "Rotation",
    //               size: 1,
    //               stride: 36,
    //               offset: 24,
    //             },
    //             Thickness: {
    //               name: "Thickness",
    //               size: 1,
    //               stride: 36,
    //               offset: 28,
    //             },
    //             Angle: {
    //               name: "Angle",
    //               size: 1,
    //               stride: 36,
    //               offset: 32,
    //             },
    //           },
  }

  makeThickLine(points: vec2[], closed?: boolean): Float32Array {
    return this.thickLine.make(points, closed);
  }
  // makeWireframe

  public drawThickLine(
    viewTransform: mat2d,
    line: vec2,
    thickness: number,
    alpha: number, // 1
    projectionMatrix?: vec4
  ): void {
    this.defaultModelViewMatrix[0] = viewTransform[0];
    this.defaultModelViewMatrix[1] = viewTransform[1];
    this.defaultModelViewMatrix[4] = viewTransform[2];
    this.defaultModelViewMatrix[5] = viewTransform[3];
    this.defaultModelViewMatrix[12] = viewTransform[4];
    this.defaultModelViewMatrix[13] = viewTransform[5];

    if (!projectionMatrix) {
      projectionMatrix = this.clearColor;
    }

    const colorWithThickness: vec4 = [
      projectionMatrix[0],
      projectionMatrix[1],
      projectionMatrix[2],
      projectionMatrix[3] * (alpha || 1),
    ];

    this.thickLine.draw(
      line,
      thickness,
      colorWithThickness,
      this.defaultModelViewMatrix,
      this.projection
    );
  }

  drawColor(
    vertexBuffer: WebGLBuffer,
    indexBuffer: WebGLBuffer,
    texture: any,
    opacity: number,
    color: number[] | vec4,
    projectionMatrix: mat4 | undefined
  ) {
    let gl = this.gl;

    // const worldMatrix = mat4.create();
    // mat4.identity(worldMatrix);

    // mat4.translate(worldMatrix, worldMatrix, [
    //   texture.position[0],
    //   texture.position[1],
    //   0,
    // ]);
    // mat4.rotateZ(worldMatrix, worldMatrix, texture.rotation);
    // mat4.scale(worldMatrix, worldMatrix, [
    //   texture.scale[0],
    //   texture.scale[1],
    //   1,
    // ]);

    // color = color.slice();
    // color[3] *= opacity;

    // const shaderProgram = texture.useTexture
    //   ? this.textureShaderProgram
    //   : this.colorShaderProgram;
    // this.useShaderProgram(shaderProgram);

    // const shaderUniforms = shaderProgram.uniforms;
    // gl.uniform1f(shaderUniforms.Opacity, opacity);
    // gl.uniform4fv(shaderUniforms.Color, color);
    // gl.uniformMatrix4fv(shaderUniforms.WorldMatrix, false, worldMatrix);
    // gl.uniformMatrix4fv(
    //   shaderUniforms.ProjectionMatrix,
    //   false,
    //   projectionMatrix || this.defaultProjectionMatrix
    // );

    // this.bindBuffer(vertexBuffer);
    // this.bindBuffer(indexBuffer, gl.ELEMENT_ARRAY_BUFFER);

    // gl.drawElements(gl.TRIANGLES, texture.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  drawGrid(
    showGrid: boolean,
    showAxis: boolean,
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
    gridOpacity: number,
    diagonalIntensity: number,
    smallIntensity: number
  ) {
    let shader;
    let gl: WebGLRenderingContext = this.gl;

    if (showGrid && showAxis) {
      shader = gridShader;
    } else if (showGrid) {
      shader = gridSubdivisionsShader;
    } else if (!showAxis) {
      // If neither grid nor axis is shown, clear the canvas with background color
      gl.clearColor(0.3628, 0.3628, 0.3628, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return;
    } else {
      shader = gridAxisShader;
    }

    // const canvasWidth = thisCanvas.viewportWidth;
    // const canvasHeight = thisCanvas.viewportHeight;
    // const vertices = new Float32Array(16);
    // vertices[1] = canvasHeight;
    // vertices[8] = canvasWidth;
    // vertices[13] = canvasHeight;

    // const uniforms = shader.uniforms;
    // thisCanvas.bind(shader, _);
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    // gl.uniform1f(uniforms.Opacity, gridOpacity);
    // gl.uniform1f(uniforms.DiagonalIntensity, diagonalIntensity);
    // gl.uniform1f(uniforms.SmallIntensity, smallIntensity);

    // const matrix = new Float32Array(16);
    // matrix[0] = canvasWidth / scaleWidth;
    // matrix[5] = canvasHeight / height;
    // matrix[12] = -offsetX / scaleWidth;
    // matrix[13] = -offsetY / height;

    // gl.uniformMatrix4fv(uniforms.WorldMatrix, false, matrix);
    // gl.uniformMatrix4fv(
    //   uniforms.ProjectionMatrix,
    //   false,
    //   thisCanvas.projection
    // );
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

export class GraphicsWrapper extends Graphics {
  private manager: GraphicsManager;

  viewportWidth: number = 0;
  viewportHeight: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.manager = new GraphicsManager(canvas);

    // r.default.call(this); // defines PieShader and stuff, also drawGrid and Selection Shader
    Object.assign(this, {
      loadTexture: this._loadTexture,
      drawGrid: this.manager.drawGrid,
    });
  }

  _loadTexture(
    elem: string | ArrayBuffer,
    flags: TextureFilteringFlags,
    preTexture: WebGLTexture
  ) {
    let gl: WebGLRenderingContext = this._GL;
    let isArray = elem.constructor === ArrayBuffer;
    // if (!isArray) {
    //   var texture = u[elem]; // cache ?
    //   if (texture) return texture;
    // }
    var texture: GraphicsTexture = Object.assign(
      preTexture || gl.createTexture(),
      {
        flags: flags || 0,
        isLoaded: false,
        width: 0,
        height: 0,
      }
    );

    // isArray || (u[elem] = texture);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    let img_tex: GraphicsTexture;
    let img = new Image();

    if (isArray) {
      var blob = new Blob([elem], {
        type: "image/jpeg",
      });
      elem = (window.URL || window.webkitURL).createObjectURL(blob);
    }

    img.src = elem as string;
    // T() => y++
    img.onload =
      ((img_tex = texture),
      function () {
        let isNotClampEdge =
          0 != (img_tex.flags & TextureFilteringFlags.ClampToEdge);
        let isNotMipMapped =
          0 != (img_tex.flags & TextureFilteringFlags.MipMapped);
        // x(); =>  _this.advanceProgress...
        img_tex.width = texture.width;
        img_tex.height = texture.height;

        var isEven = !(
          0 == img.width ||
          img.width & (img.width - 1) ||
          0 == img.height ||
          img.height & (img.height - 1)
        );
        gl.bindTexture(gl.TEXTURE_2D, img_tex);

        if (img_tex.flags & TextureFilteringFlags.MultiplyAlpha) {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        } else {
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        }

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          this as TexImageSource // TODO
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          isEven && isNotMipMapped ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR
        );

        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_WRAP_S,
          isEven && !isNotClampEdge ? gl.REPEAT : gl.CLAMP_TO_EDGE
        );
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_WRAP_T,
          isEven && !isNotClampEdge ? gl.REPEAT : gl.CLAMP_TO_EDGE
        );
        isEven && isNotMipMapped && gl.generateMipmap(gl.TEXTURE_2D),
          gl.bindTexture(gl.TEXTURE_2D, null);
      });
    img.onerror = (e) => {
      return function () {
        texture.isLoaded = false;
      };
    };

    console.log("_loadTexture");

    return texture;
  }

  drawColor(
    vertexBuffer: WebGLBuffer,
    indexBuffer: WebGLBuffer,
    texture: any, // TODO
    opacity: number = 1,
    color: vec4 | number[] = [0, 0, 0, 1],
    projectionMatrix?: mat4
  ): void {
    this.manager.drawColor(
      vertexBuffer,
      indexBuffer,
      texture,
      opacity,
      color,
      projectionMatrix
    );
    throw new Error("Method not implemented.");
  }

  makeThickLine(points: vec2[], closed?: boolean): Float32Array {
    return this.manager.makeThickLine(points, closed);
  }

  drawTextured(
    _SoloTransform: any,
    _SoloVertexBuffer: any,
    _SoloIndexBuffer: any,
    arg3: number,
    arg4: number[],
    texture: any
  ) {
    throw new Error("Method not implemented.");
  }

  makeFrameBuffer(): any {
    // TODO !!
    throw new Error("Method not implemented.");
  }

  drawGrid(
    showGrid: boolean,
    showAxis: boolean,
    offsetX: number,
    offsetY: number,
    width: number,
    height: number,
    gridOpacity: number,
    diagonalIntensity: number,
    smallIntensity: number
  ) {
    this.manager.drawGrid(
      showGrid,
      showAxis,
      width,
      height,
      offsetX,
      offsetY,
      gridOpacity,
      diagonalIntensity,
      smallIntensity
    );
  }
  drawThickLine(
    viewTransform: mat2d,
    line: vec2,
    thickness: number,
    alpha: number, // 1
    projectionMatrix?: vec4
  ) {
    this.manager.drawThickLine(
      viewTransform,
      line,
      thickness,
      alpha,
      projectionMatrix
    );
  }
}

// interface GraphicsWrapper extends Graphics, GraphicsShaders {}

// applyMixins(GraphicsWrapper, [Graphics, GraphicsShaders]);

// export default GraphicsWrapper;
