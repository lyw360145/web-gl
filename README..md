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