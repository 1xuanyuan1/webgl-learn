"use strict";

/**
 * 创建一个着色器
 * @param {WebGLRenderingContext} gl 
 * @param {number} type 
 * @param {string} source 
 * @returns 
 */
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLShader} vertexShader 
 * @param {WebGLShader} fragmentShader 
 * @returns 
 */
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main () {
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  /** @type {WebGLRenderingContext} */
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  var vertexShaderSource = document.querySelector("#vertex-sharder-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-sharder-2d").text;
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);
  
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var colorUniformLocation = gl.getUniformLocation(program, "u_color");
  
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30,
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // 告诉WebGL如何将剪辑空间映射到像素空间
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // 清空画布
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 告诉WebGL使用我们之前写好的着色器程序
  gl.useProgram(program);

  // 传入顶点数据
  gl.enableVertexAttribArray(positionAttributeLocation);

  // 将绑定点绑定到缓冲数据
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
  var size = 2;          // 每次迭代运行提取两个单位数据
  var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
  var normalize = false; // 不需要归一化数据
  var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                         // 每次迭代运行运动多少内存到下一个数据开始点
  var offset = 0;        // 从缓冲起始位置开始读取
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  // 设置全局变量 分辨率
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // 绘制
  // var primitiveType = gl.TRIANGLES;
  // var offset = 0;
  // var count = 6;
  // gl.drawArrays(primitiveType, offset, count);

    // 绘制50个随机颜色矩形
  for (var ii = 0; ii < 50; ++ii) {
    // 创建一个随机矩形
    // 并将写入位置缓冲
    // 因为位置缓冲是我们绑定在
    // `ARRAY_BUFFER`绑定点上的最后一个缓冲
    setRectangle(
        gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
  
    // 设置一个随机颜色
    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
  
    // 绘制矩形
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

/**
 * 返回 0 到 range 范围内的随机整数
 * @param {number} range 
 * @returns 
 */
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

/**
 * 用参数生成矩形顶点并写进缓冲
 * @param {WebGLRenderingContext} gl 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 */
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
 
  // 注意: gl.bufferData(gl.ARRAY_BUFFER, ...) 将会影响到
  // 当前绑定点`ARRAY_BUFFER`的绑定缓冲
  // 目前我们只有一个缓冲，如果我们有多个缓冲
  // 我们需要先将所需缓冲绑定到`ARRAY_BUFFER`
 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}

(function(){
  main()
})()