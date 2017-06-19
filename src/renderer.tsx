import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ImageFrame } from "./image_loader";

interface RendererProps {
    image: ImageFrame | null
    outputWidth: number
}

const vertex = `
attribute vec2 a_position;
attribute vec2 a_texCoord;

varying vec2 v_texCoord;

void main() {
   gl_Position = vec4(a_position, 0.0, 1.0);
   v_texCoord = a_texCoord;
}
`

const fragment = `
precision mediump float;

uniform sampler2D u_image;
uniform vec2 imageSize;
uniform vec2 outputSize;

varying vec2 v_texCoord;

void main() {
    vec2 xy = floor(v_texCoord * outputSize);
    float pixelOffset = xy.x + (xy.y * outputSize.x);

    vec2 newXy = vec2(mod(pixelOffset, imageSize.x), floor(pixelOffset / imageSize.x));

    vec4 sample = texture2D(u_image, newXy / imageSize);
    gl_FragColor = sample;
}
`

const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader)
        throw 'Could not compile \n\n' + info
    }
    return shader
}

export default class ImageRenderer extends React.Component<RendererProps, null> {
    texture?: WebGLTexture;
    outputSizeLocation: WebGLUniformLocation;
    imageSizeLocation: WebGLUniformLocation
    _ctx: WebGLRenderingContext
    _canvas: HTMLCanvasElement

    componentDidMount() {
        this._canvas = ReactDOM.findDOMNode(this) as HTMLCanvasElement
        this._ctx = this._canvas.getContext('webgl', { preserveDrawingBuffer: true })

        this.setup3d(this._ctx)
    }

    componentWillReceiveProps(newProps: RendererProps) {
        if (!newProps.image) {
            return
        }

        if (newProps.image !== this.props.image) {
            this.updateSize(newProps.image.width, newProps.image.height)
            this._ctx.uniform2fv(this.imageSizeLocation, [newProps.image.width, newProps.image.height])

            if (this.texture) {
                this._ctx.deleteTexture(this.texture)
            }
            this.texture = this._ctx.createTexture()
            this._ctx.bindTexture(this._ctx.TEXTURE_2D, this.texture);
            this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_WRAP_S, this._ctx.CLAMP_TO_EDGE);
            this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_WRAP_T, this._ctx.CLAMP_TO_EDGE);
            this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_MIN_FILTER, this._ctx.NEAREST);
            this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_MAG_FILTER, this._ctx.NEAREST);
            this._ctx.texImage2D(this._ctx.TEXTURE_2D, 0, this._ctx.RGBA, this._ctx.RGBA, this._ctx.UNSIGNED_BYTE, newProps.image.canvas);
        }

        if (newProps.outputWidth !== this.props.outputWidth) {
            const newHeight = Math.ceil(newProps.image.width * newProps.image.height / newProps.outputWidth)
            this._ctx.uniform2fv(this.outputSizeLocation, [newProps.outputWidth, newHeight])
            this.updateSize(newProps.outputWidth, newHeight)

        }
        this.render3d(newProps.image, newProps)
    }

    public export(): Promise<string> {
        return Promise.resolve(this._canvas.toDataURL('image/png'))
    }

    private updateSize(width: number, height: number): void {
        this._canvas.width = width
        this._canvas.height = height
        this._ctx.viewport(0, 0, width, height)
    }

    private setup3d(gl: WebGLRenderingContext) {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex)
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment)
        const program = gl.createProgram()
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        gl.useProgram(program)

        // Position data
        const positionLocation = gl.getAttribLocation(program, "a_position")
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            1.0, 1.0]), gl.STATIC_DRAW)
        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

        // Texture data
        const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
        const texCoordBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 1.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 0.0,
            1.0, 1.0,
            1.0, 0.0]), gl.STATIC_DRAW)
        gl.enableVertexAttribArray(texCoordLocation)
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

        this.imageSizeLocation = gl.getUniformLocation(program, 'imageSize')
        this.outputSizeLocation = gl.getUniformLocation(program, 'outputSize')
    }

    private render3d(imageData: ImageFrame, props: RendererProps) {
        if (this._ctx && imageData && this.texture) {
            this._ctx.drawArrays(this._ctx.TRIANGLES, 0, 6)
        }
    }

    render() {
        return (<canvas className="image-canvas" />)
    }
}
