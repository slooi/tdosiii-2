console.log("webgl.js loaded");

/**
 * @type {string|null}
 * */
let vSource, fSource;

const u_Renderer = {
	CLEAR_CIRCLE: 0,
	TRIANGLE: 1,
	TRIANGLE_TEX: 2,
	CIRCLE: 3,
};

Promise.all([
	getShaderSource("vSource.vert"),
	getShaderSource("fSource.frag"),
]).then((textArr) => {
	vSource = textArr[0];
	fSource = textArr[1];
	createWebgl();
});
/**
 * @param {string} fileName
 * @return {Promise<string>}
 *
 */
function getShaderSource(fileName) {
	return new Promise((resolve) => {
		fetch(fileName)
			.then((res) => res.text())
			.then((text) => {
				resolve(text);
			})
			.catch((err) => {
				throw new Error("ERROR: issue loading shader sources");
			});
	});
}

function createWebgl() {
	/**
	 * @type {HTMLCanvasElement}
	 */
	const canvas = document.getElementById("canvas");
	if (!canvas) {
		throw new Error("Canvas does not  exist");
	}
	canvas.width = 500;
	canvas.height = 500;
	canvas.style.width = "500px";
	canvas.style.height = "500px";

	// gl
	/**
	 * @type {WebGLRenderingContext|null}
	 */
	let gl = canvas.getContext("webgl", { antialias: true });
	if (!gl) {
		throw new Error(
			"ERROR: no versions of webgl are available. Please use an updated browser which supports webgl like firefox or chrome"
		);
	}

	// view port and color
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 1);
	gl.clearColor(0.121, 0.169, 0.612, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.enable(gl.BLEND);
	gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
	// gl.disable(gl.DEPTH_TEST);
	// gl.disable(gl.STENCIL_TEST);
	gl.getExtension("OES_standard_derivatives");

	// program
	const program = buildProgram(gl);
	gl.useProgram(program);

	// locations
	// Attrib
	const attribLocation = {};
	for (
		let i = 0;
		i < gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
		i++
	) {
		const name = gl.getActiveAttrib(program, i)?.name;
		if (!name) {
			throw new Error("ERROR: name is undefined.");
		}
		attribLocation[name] = gl.getAttribLocation(program, name);
	}

	// Uniform
	const uniformLocation = {};
	for (
		let i = 0;
		i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
		i++
	) {
		const name = gl.getActiveUniform(program, i)?.name;
		if (!name) {
			throw new Error("ERROR: name is undefined");
		}
		uniformLocation[name] = gl.getUniformLocation(program, name);
	}

	// Data
	// Positions
	// prettier-ignore
	// const visionPos = [
	// 	0, 0,
	// 	0.1, 0.8,
	// 	0.9, 0.9
	// ];
	// // prettier-ignore
	// const trianglePos = [
	// 	0, 0,
	// 	0.1, 0.8,
	// 	0.9, 0.9
	// ];
	// // prettier-ignore
	// const triangleColors = [
	// 	255,0,0,255,
	// 	0,0,255,255,
	// 	0,255,0,255
	// ]
	// prettier-ignore
	const circlePos = [

	]
	// prettier-ignore
	const trianglePos = [

	]
	// Color - can be appied to both circlePos and trianglePos
	// prettier-ignore
	const color = [

	]
	// uv - only applies to trianglePos
	// prettier-ignore
	const uv = [

	]

	// BUFFER
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(visionPos),
		gl.DYNAMIC_DRAW
	);
	// vertex array attribute pointer
	gl.enableVertexAttribArray(attribLocation.a_Position);
	gl.vertexAttribPointer(
		attribLocation.a_Position,
		2,
		gl.FLOAT,
		false,
		Float32Array.BYTES_PER_ELEMENT * 2,
		Float32Array.BYTES_PER_ELEMENT * 0
	);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Uint8Array(triangleColors),
		gl.DYNAMIC_DRAW
	);

	// vertex array attribute pointer
	gl.enableVertexAttribArray(attribLocation.a_Color);
	gl.vertexAttribPointer(
		attribLocation.a_Color,
		4,
		gl.UNSIGNED_BYTE,
		true,
		Uint8Array.BYTES_PER_ELEMENT * 4,
		Uint8Array.BYTES_PER_ELEMENT * 0
	);

	// Texture
	const fog = buildTexture(gl);
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(uniformLocation.u_Renderer, 0);

	//##########
	// Draw
	//##########
	// Points
	// gl.uniform1i(uniformLocation.u_Renderer, 0);
	// gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
	// gl.drawArrays(gl.POINTS, 0, visionPos.length / 2);

	// Triangles (textures)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(trianglePos),
		gl.STATIC_DRAW
	);
	gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
	gl.uniform1i(uniformLocation.u_Renderer, 1);
	gl.drawArrays(gl.TRIANGLES, 0, trianglePos.length / 2);

	//#################################
	// FUNCTIONS
	//#################################
	function createBlackCanvas() {
		const texData = new Uint8Array(canvas.width * canvas.height * 4);
		for (let i = 3; i < canvas.width * canvas.height * 4; i = i + 4) {
			texData[i] = 255;
		}
		return texData;
	}

	/**
	 * @param {WebGLRenderingContext} gl
	 */
	// function buildFrameBuffer(gl) {
	// 	const framebuffer = gl.createFramebuffer();
	// 	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

	// 	gl.framebufferTexture2D(
	// 		gl.FRAMEBUFFER,
	// 		gl.COLOR_ATTACHMENT0,
	// 		gl.TEXTURE_2D,
	// 		webglTex,
	// 		0
	// 	);
	// 	return framebuffer;
	// }

	/**
	 * @param {WebGLRenderingContext} gl
	 */
	function buildTexture(gl) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		const lightTextureData = createBlackCanvas();
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			canvas.width,
			canvas.height,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			lightTextureData // can pass in null
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		return texture;
	}

	/**
	 * @param {WebGLRenderingContext} gl
	 * @param {number} type
	 * @param {string} shaderSource
	 * @return {null|any}
	 */
	function buildShader(gl, type, shaderSource) {
		const shader = gl.createShader(type);
		if (!shader) {
			throw new Error("ERROR: shader doesn't exist");
		}
		gl.shaderSource(shader, shaderSource);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw new Error(
				"ERROR: could not compile shader. Info: " +
					gl.getShaderInfoLog(shader)
			);
		}

		return shader;
	}

	/**
	 *
	 * @param {WebGLRenderingContext} gl
	 * @returns
	 */
	function buildProgram(gl) {
		if (!vSource || !fSource) {
			throw new Error("ERROR: could not load vSource or fSource!");
		}

		const program = gl.createProgram();
		if (!program) {
			throw new Error("ERROR: program doesn't exist");
		}
		gl.attachShader(program, buildShader(gl, gl.VERTEX_SHADER, vSource));
		gl.attachShader(program, buildShader(gl, gl.FRAGMENT_SHADER, fSource));
		gl.linkProgram(program);
		gl.validateProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw new Error(
				"ERROR: could not link program. Info: " +
					gl.getProgramInfoLog(program)
			);
		}
		if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
			throw new Error(
				"ERROR: could not validate program. Info: " +
					gl.getProgramInfoLog(program)
			);
		}
		return program;
	}

	/**
	 * @param {number[]} circleArray
	 * @param {boolean} clear
	 * */
	function drawCircles(circleArray, clear) {
		// Check
		if (!gl) {
			throw new Error("ERROR: gl doesn't exist!");
		}

		if (clear) {
			// Set rendering mode & blending
			gl.uniform1i(uniformLocation.u_Renderer, u_Renderer.CLEAR_CIRCLE);
			gl.blendFuncSeparate(
				gl.SRC_ALPHA,
				gl.ONE_MINUS_SRC_ALPHA,
				gl.ONE,
				gl.ONE
			);
		} else {
			// Set rendering mode
			gl.uniform1i(uniformLocation.u_Renderer, u_Renderer.CIRCLE);
		}

		// Bind & buffer data
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(circleArray),
			gl.DYNAMIC_DRAW
		);

		// Draw
		gl.drawArrays(gl.POINTS, 0, circleArray.length / 2);

		// Reset blending to normal
		if (clear) {
			gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
		}
	}

	return { drawCircles };
}
