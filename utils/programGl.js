const getShader = (gl, code, crateType) => {
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
    // return shaderProgram;
    if (success) {
        return shaderProgram;
      }

     console.error(gl.getProgramInfoLog(shaderProgram));
//   gl.deleteProgram(shaderProgram);
}
const randomColor = () => {
        const random = Math.random;
        return {
            r: random(),
            g: random(),
            b: random(),
            a: random() * 1
        };
    }
    // 按顺序
const createBuffer = (gl, attribute, vertexAttribPointer) => {
        //  offset开始读取 stride 每读取一次偏移量
        let { size, type, normalize, stride, offset } = vertexAttribPointer;
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
    /**
     * @description 矩阵转置
     * @param {*} matrix
     * 
     */
function matrixRowTransforCol(matrix, defualt) {
    if (!matrix) {
        return defualt
    }
    const target = []
    target[0] = matrix[0]
    target[4] = matrix[1]
    target[8] = matrix[2]
    target[12] = matrix[3]

    target[1] = matrix[4]
    target[5] = matrix[5]
    target[9] = matrix[6]
    target[13] = matrix[7]

    target[2] = matrix[8]
    target[6] = matrix[9]
    target[10] = matrix[10]
    target[14] = matrix[11]

    target[3] = matrix[12]
    target[7] = matrix[13]
    target[11] = matrix[14]
    target[15] = matrix[15]

    return target;
}
function printSineAndCosineForAnyAngle(angleInDegrees) {
    var angleInRadians = angleInDegrees * Math.PI / 180;
    return angleInRadians;

}