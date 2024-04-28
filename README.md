## 不加精度定义uniform报错

 precision mediump float;

```js   precision mediump float;
        attribute vec2 position;
        attribute vec2 position1;
        void main(){
           gl_Position = vec4(position,0,1.0);
           gl_PointSize = 10.0;
            
        }
```
## 矩阵模型
就是通过计算生成的矩阵

## 公式



##  翻译工具 （沉浸式翻譯）
https://immersivetranslate.com/zh-TW/

## webgl 尽量用带小数点


  const createCircle = (x, y, radius, n) => {
            const vertices = [];
            vertices.push(x, y, 0, 0, 255, 0);

            for (let i = 0; i < n; i++) {
                const angle = (2 * Math.PI / n) * i;
                const x1 = x + radius * Math.cos(angle);
                const y1 = y + radius * Math.sin(angle);
                vertices.push(x1, y1, 0, 0, 255, 0);
            }
            return vertices;
        };