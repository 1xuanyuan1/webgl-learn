    // 一个属性变量，从缓冲中获取数据
    attribute vec4 a_position;

    void main() {
      // gl_Position是一个顶点着色器主要设置的变量
      gl_Position = a_position;
    }
    