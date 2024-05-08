// 片段着色器没有默认精度，所以我们需要在片段着色器中指定一个精度。
// mediump 是一个不错的默认值，代表“medium precision”（中等精度）。
precision mediump float;

void main() {
  // gl_FragColor 是一个片段着色器主要设置的变量，它决定了一个片段的最终颜色。
  gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
}