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