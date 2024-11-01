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
function multiply(next, prev, target) {
    target = target || new Float32Array(16);
    // 第一列
    var p00 = prev[0];
    var p10 = prev[1];
    var p20 = prev[2];
    var p30 = prev[3];
    // 第二列
    var p01 = prev[4];
    var p11 = prev[5];
    var p21 = prev[6];
    var p31 = prev[7];
    // 第三列
    var p02 = prev[8];
    var p12 = prev[9];
    var p22 = prev[10];
    var p32 = prev[11];

    // 第四列
    var p03 = prev[12];
    var p13 = prev[13];
    var p23 = prev[14];
    var p33 = prev[15];

    // 第一行
    var n00 = next[0];
    var n01 = next[4];
    var n02 = next[8];
    var n03 = next[12];
    // 第二行
    var n10 = next[1];
    var n11 = next[5];
    var n12 = next[9];
    var n13 = next[13];
    // 第三行
    var n20 = next[2];
    var n21 = next[6];
    var n22 = next[10];
    var n23 = next[14];

    // 第四行
    var n30 = next[3];
    var n31 = next[7];
    var n32 = next[11];
    var n33 = next[15];

    target[0] = p00 * n00 + p10 * n01 + p20 * n02 + p30 * n03;
    target[1] = p00 * n10 + p10 * n11 + p20 * n12 + p30 * n13;
    target[2] = p00 * n20 + p10 * n21 + p20 * n22 + p30 * n23;
    target[3] = p00 * n30 + p10 * n31 + p20 * n32 + p30 * n33;

    target[4] = p01 * n00 + p11 * n01 + p21 * n02 + p31 * n03;
    target[5] = p01 * n10 + p11 * n11 + p21 * n12 + p31 * n13;
    target[6] = p01 * n20 + p11 * n21 + p21 * n22 + p31 * n23;
    target[7] = p01 * n30 + p11 * n31 + p21 * n32 + p31 * n33;

    target[8] = p02 * n00 + p12 * n01 + p22 * n02 + p32 * n03;
    target[9] = p02 * n10 + p12 * n11 + p22 * n12 + p32 * n13;
    target[10] = p02 * n20 + p12 * n21 + p22 * n22 + p32 * n23;
    target[11] = p02 * n30 + p12 * n31 + p22 * n32 + p32 * n33;

    target[12] = p03 * n00 + p13 * n01 + p23 * n02 + p33 * n03;
    target[13] = p03 * n10 + p13 * n11 + p23 * n12 + p33 * n13;
    target[14] = p03 * n20 + p13 * n21 + p23 * n22 + p33 * n23;
    target[15] = p03 * n30 + p13 * n31 + p23 * n32 + p33 * n33;

    return target;
  }

function createSphere(radius, divideByYAxis, divideByCircle) {
    let yUnitAngle = Math.PI / divideByYAxis;
    let circleUnitAngle = (Math.PI * 2) / divideByCircle;
    let positions = [];
    let normals = [];
    for (let i = 0; i <= divideByYAxis; i++) {
      let unitY = Math.cos(yUnitAngle * i);
      let yValue = radius * unitY;
  
      for (let j = 0; j <= divideByCircle; j++) {
        let unitX = Math.sin(yUnitAngle * i) * Math.cos(circleUnitAngle * j);
        let unitZ = Math.sin(yUnitAngle * i) * Math.sin(circleUnitAngle * j);
        let xValue = radius * unitX;
        let zValue = radius * unitZ;
        positions.push(xValue, yValue, zValue);
        normals.push(unitX, unitY, unitZ);
      }
    }
  
    let indices = [];
    let circleCount = divideByCircle + 1;
    for (let j = 0; j < divideByCircle; j++) {
      for (let i = 0; i < divideByYAxis; i++) {
        indices.push(i * circleCount + j);
        indices.push(i * circleCount + j + 1);
        indices.push((i + 1) * circleCount + j);
  
        indices.push((i + 1) * circleCount + j);
        indices.push(i * circleCount + j + 1);
        indices.push((i + 1) * circleCount + j + 1);
      }
    }
    return {
      positions: new Float32Array(positions),
      indices: new Uint16Array(indices),
      normals: new Float32Array(normals)
    };
  }

  function initBuffers(latitudeBands,longitudeBands,radius) {
	//存储顶点坐标
       var vertexPositionData = [];
	//存储纹理坐标
       var textureCoordData = [];

	//从纬线开始遍历
       for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
		//计算θ角度
           var theta = latNumber * Math.PI / latitudeBands;
           var sinTheta = Math.sin(theta);
           var cosTheta = Math.cos(theta);

           for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
			//计算φ角度
               var phi = longNumber * 2 * Math.PI / longitudeBands;
               var sinPhi = Math.sin(phi);
               var cosPhi = Math.cos(phi);
			//计算顶点的x,y,z坐标
               var x = radius * cosPhi * sinTheta;
               var y = radius * cosTheta;
               var z = radius * sinPhi * sinTheta;
			//贴图是矩形的，我们将贴图在X轴上按照经线划分，在Y轴上按照纬线划分，来计算顶点对应的贴图U，V坐标
               var u = longNumber / longitudeBands;
               var v = latNumber / latitudeBands;
			
			
               textureCoordData.push(u);
               textureCoordData.push(v);
               vertexPositionData.push(x);
               vertexPositionData.push(y);
               vertexPositionData.push(z);
           }
       }
	//存储顶点索引
       var indexData = [];
       for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
           for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
               var A = (latNumber * (longitudeBands + 1)) + longNumber;
               var B = A + longitudeBands + 1;
			var C = A + 1;
			var D = B + 1;
               indexData.push(A);
               indexData.push(B);
               indexData.push(C);

               indexData.push(B);
               indexData.push(D);
               indexData.push(C);
           }
       }
    return {
        indexData,vertexPositionData
    }
    }
