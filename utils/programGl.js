const getShader = (gl, code,crateType) => {
    const shaderFile = gl.createShader(crateType);
    gl.shaderSource(shaderFile, code);
    gl.compileShader(shaderFile);
    return shaderFile;
}

const getShaderProgram = (gl, vertexShader, fragmentShader) => {
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    let success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    console.log(success,'success')
   
    return shaderProgram;
}
const randomColor = () => {
    const random = Math.random;
    return {
      r: random() * 255,
      g: random() * 255,
      b: random() * 255,
      a: random() * 1
    };
  }
 // 按顺序
  const  createBuffer = (gl, attribute, vertexAttribPointer) => {
    let {size, type, normalize, stride, offset} = vertexAttribPointer;
    gl.enableVertexAttribArray(attribute);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
      attribute,
      size,
      type || gl.FLOAT,
      normalize || false,
      stride || 0,
      offset || 0
    );
    return buffer;
  }