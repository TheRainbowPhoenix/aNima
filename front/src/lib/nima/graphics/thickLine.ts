import { vec2, vec4, mat4 } from "gl-matrix"; // Import necessary dependencies

export class ThickLineShaders {
  private gl: WebGLRenderingContext;
  private buffer: WebGLBuffer;
  private program: WebGLProgram;
  private positionAttributeLocation: number;
  private normalAttributeLocation: number;
  private miterAttributeLocation: number;
  private projectionUniformLocation: WebGLUniformLocation | null;
  private modelViewUniformLocation: WebGLUniformLocation | null;
  private thicknessUniformLocation: WebGLUniformLocation | null;
  private colorUniformLocation: WebGLUniformLocation | null;
  private innerUniformLocation: WebGLUniformLocation | null;

  direction = vec2.create(); // t
  nextDirection = vec2.create(); // n
  referenceVector = vec2.create(); // r
  perpendicularVector = vec2.create(); // o
  a = vec2.create();
  defaultProjectionMatrix = mat4.create(); // w
  defaultModelViewMatrix = mat4.create(); // O
  defaultColor = vec4.create(); // S

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    let buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error("No WebGLRenderingContext Buffer for ThickLine");
    }

    this.buffer = buffer;
    this.program = this.gl.createProgram()!;
    this.positionAttributeLocation = -1;
    this.normalAttributeLocation = -1;
    this.miterAttributeLocation = -1;
    this.projectionUniformLocation = null;
    this.modelViewUniformLocation = null;
    this.thicknessUniformLocation = null;
    this.colorUniformLocation = null;
    this.innerUniformLocation = null;
    this.initializeShader();
  }

  private initializeShader(): void {
    const vertexShaderSource = `
            attribute vec2 position;
            attribute vec2 normal;
            attribute float miter;
            uniform mat4 projection;
            uniform mat4 modelView;
            uniform float thickness;
            varying float edge;
            void main() {
                edge = sign(miter);
                vec2 pointPos = position.xy + vec2(normal * thickness / 2.0 * miter);
                gl_Position = projection * modelView * vec4(pointPos, 0.0, 1.0);
            }
        `;

    const fragmentShaderSource = `
            precision highp float;
            uniform vec4 color;
            uniform float inner;
            varying float edge;
            void main() {
                float v = abs(edge);
                v = max(0.0, v - inner) / (1.0 - inner);
                gl_FragColor = mix(color, vec4(color.xyz, 0.0), v);
            }
        `;

    const vertexShader = this.compileShader(
      vertexShaderSource,
      this.gl.VERTEX_SHADER
    );
    const fragmentShader = this.compileShader(
      fragmentShaderSource,
      this.gl.FRAGMENT_SHADER
    );

    if (!vertexShader || !fragmentShader) {
      console.error("Failed to compile shaders");
      return;
    }

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(
        "Failed to link shader program:",
        this.gl.getProgramInfoLog(this.program)
      );
      return;
    }

    this.gl.useProgram(this.program);

    this.positionAttributeLocation = this.getAttributeLocation("position");
    this.normalAttributeLocation = this.getAttributeLocation("normal");
    this.miterAttributeLocation = this.getAttributeLocation("miter");

    this.projectionUniformLocation = this.gl.getUniformLocation(
      this.program,
      "projection"
    );
    this.modelViewUniformLocation = this.gl.getUniformLocation(
      this.program,
      "modelView"
    );
    this.thicknessUniformLocation = this.gl.getUniformLocation(
      this.program,
      "thickness"
    );
    this.colorUniformLocation = this.gl.getUniformLocation(
      this.program,
      "color"
    );
    this.innerUniformLocation = this.gl.getUniformLocation(
      this.program,
      "inner"
    );

    this.gl.useProgram(null);
  }

  private compileShader(source: string, type: number): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) {
      console.error("Failed to create shader");
      return null;
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(
        "Failed to compile shader:",
        this.gl.getShaderInfoLog(shader)
      );
      return null;
    }
    return shader;
  }

  public calculateNormal(a: vec2, b: vec2) {
    return vec2.set(a, -b[1], b[0]), a;
  }

  addLineSegment(
    vertexArray: (vec2 | number)[],
    startPoint: vec2,
    endPoint: vec2,
    thickness: number
  ): void {
    vertexArray.push(
      startPoint[0],
      startPoint[1], // Start point
      endPoint[0],
      endPoint[1], // End point
      thickness, // Thickness
      startPoint[0],
      startPoint[1], // Start point (again)
      endPoint[0],
      endPoint[1], // End point (again)
      -thickness // Negative thickness (for the other side of the line)
    );
  }

  calculateLineThickness(
    edgeVector: vec2,
    perpendicularVector: vec2,
    referenceVector: vec2,
    normalVector: vec2,
    constantThickness: number
  ): number {
    vec2.add(edgeVector, referenceVector, normalVector);
    vec2.normalize(edgeVector, edgeVector);
    const perpendicularReference = vec2.create();
    vec2.set(perpendicularVector, -edgeVector[1], edgeVector[0]);
    vec2.set(perpendicularReference, -referenceVector[1], referenceVector[0]);
    return (
      constantThickness / vec2.dot(perpendicularVector, perpendicularReference)
    );
  }

  private getAttributeLocation(attributeName: string): number {
    const location = this.gl.getAttribLocation(this.program, attributeName);
    if (location === -1) {
      console.warn(`Failed to get attribute location for ${attributeName}`);
    }
    return location;
  }

  public make(points: vec2[], closed: boolean = false): Float32Array {
    const vertices: number[] = [];
    let previousDirection: vec2 | null = null;

    if (closed) {
      points = points.slice();
      points.push(points[0]);
    }

    for (let i = 1; i < points.length; i++) {
      const previousPoint = points[i - 1];
      const currentPoint = points[i];
      const nextPoint = i < points.length - 1 ? points[i + 1] : null;

      vec2.subtract(this.direction, currentPoint, previousPoint);
      vec2.normalize(this.direction, this.direction);

      if (!previousDirection) {
        previousDirection = vec2.create();
        this.calculateNormal(previousDirection, this.direction); // s
      }

      if (i === 1) {
        this.addLineSegment(vertices, previousPoint, previousDirection, 1);
      }

      if (nextPoint) {
        vec2.subtract(this.nextDirection, nextPoint, currentPoint);
        const thickness = this.calculateLineThickness(
          this.referenceVector,
          this.perpendicularVector,
          this.direction,
          this.nextDirection,
          1
        ); // c
        this.addLineSegment(
          vertices,
          currentPoint,
          this.perpendicularVector,
          thickness
        );
      } else {
        this.calculateNormal(previousDirection, this.direction);
        this.addLineSegment(vertices, currentPoint, previousDirection, 1);
      }
    }

    if (points.length > 2 && closed && previousDirection) {
      /* _ */ const secondLastPoint = points[points.length - 2];
      /* b */ const firstPoint = points[0];
      /* w */ const secondPoint = points[1];

      vec2.subtract(this.direction, firstPoint, secondLastPoint);
      vec2.subtract(this.nextDirection, secondPoint, firstPoint);
      this.calculateNormal(previousDirection, this.direction);
      const thickness = this.calculateLineThickness(
        this.referenceVector,
        this.perpendicularVector,
        this.direction,
        this.nextDirection,
        1
      );
      const S = 5 * (points.length - 1) * 2;

      vertices[S + 2] =
        vertices[2] =
        vertices[S + 2 + 5] =
        vertices[7] =
          this.perpendicularVector[0];
      vertices[S + 3] =
        vertices[3] =
        vertices[S + 3 + 5] =
        vertices[8] =
          this.perpendicularVector[1];
      vertices[S + 4] = vertices[4] = thickness;
      vertices[S + 4 + 5] = vertices[9] = -thickness;
    }

    return new Float32Array(vertices);
  }

  public draw(
    vertices: vec2,
    thickness: number = 1,
    color: vec4 = [0, 0, 0, 1],
    projection?: mat4,
    modelView?: mat4
  ): void {
    if (projection === undefined) {
      projection = this.defaultProjectionMatrix;
    }
    const gl = this.gl;

    if (modelView === undefined) {
      mat4.ortho(
        this.defaultModelViewMatrix,
        0,
        gl.canvas.width,
        gl.canvas.height,
        0,
        0,
        1
      );
      modelView = this.defaultModelViewMatrix;
    }
    const numComponents = 5; // position (x,y) + normal (x,y) + miter
    const stride = numComponents * Float32Array.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);

    if (currentProgram !== this.program) {
      if (currentProgram) {
        const numAttributes = gl.getProgramParameter(
          currentProgram,
          gl.ACTIVE_ATTRIBUTES
        );
        for (let i = 1; i < numAttributes; i++) {
          gl.disableVertexAttribArray(i);
        }
      }

      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.enableVertexAttribArray(this.positionAttributeLocation);
      gl.vertexAttribPointer(
        this.positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        20,
        0
      );
      gl.enableVertexAttribArray(this.normalAttributeLocation);
      gl.vertexAttribPointer(
        this.normalAttributeLocation,
        2,
        gl.FLOAT,
        false,
        20,
        8
      );
      gl.enableVertexAttribArray(this.miterAttributeLocation);
      gl.vertexAttribPointer(
        this.miterAttributeLocation,
        1,
        gl.FLOAT,
        false,
        20,
        16
      );
    }

    // Calculate line properties
    const orthoX = projection[0];
    const orthoY = projection[1];
    const lineLength = Math.sqrt(orthoX * orthoX + orthoY * orthoY);
    const extension = thickness + 2 / lineLength;
    const totalLength = extension * lineLength;

    vec4.copy(this.defaultColor, color);

    // Set uniforms and draw
    gl.uniformMatrix4fv(this.projectionUniformLocation, false, projection);
    gl.uniformMatrix4fv(this.modelViewUniformLocation, false, modelView);

    gl.uniform1f(this.thicknessUniformLocation, extension);
    gl.uniform4fv(this.colorUniformLocation, this.defaultColor);
    const cappedWidth = Math.max(0, (totalLength / 2 - 1) / (totalLength / 2));
    gl.uniform1f(this.innerUniformLocation, cappedWidth);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 5);
  }
}
