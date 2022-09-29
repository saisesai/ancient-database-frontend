<script setup lang="ts">
import {onMounted} from "vue";

const props = defineProps({
  edit_mode: {type: Boolean, required: true},
  page_id: {type: Number, required: true},
})

let object_offset_x = 0;
let object_offset_y = 0;
let object_scale_prev = 1.0;
let object_scale = 1.0;
const page_image = new Image();
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let mouse_drag = false;
let mouse_select = false;
let select_1st_x = 0.0;
let select_1st_y = 0.0;
let select_2nd_x = 0.0;
let select_2nd_y = 0.0;

const set_image_url = (image_url: string) => {
  page_image.src = image_url;
}

const page_add_char = (px1: number, py1: number, px2: number, py2: number) => {

}

const canvas_clear_buffer = () => {
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

const canvas_draw_selecting = (px: number, py: number, pw: number, ph: number) => {
  ctx.save();
  ctx.strokeStyle = "aqua";
  ctx.strokeRect(px, py, pw, ph);
  ctx.restore()
}

const draw = () => {
  ctx.save();
  // clear buffer
  canvas_clear_buffer();
  // draw image
  ctx.drawImage(page_image, object_offset_x, object_offset_y, 192 * object_scale, 192 * object_scale);

  // 编辑模式
  if (props.edit_mode) {
    canvas_draw_selecting(select_1st_x, select_1st_y, select_2nd_x - select_1st_x, select_2nd_y - select_1st_y);
  }
  ctx.restore();
}

const canvas_setup = () => {
  // init canvas
  canvas = document.getElementById("edit-canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // set event
  canvas.onwheel = (event: WheelEvent) => {
    event.preventDefault();

    let object_scale_d = Math.abs(event.deltaY) / event.deltaY * 0.2;
    if (object_scale <= 0.3 && object_scale_d < 0) return;
    object_scale_prev = object_scale;
    object_scale += object_scale_d;

    object_offset_x += (1.0 - object_scale / object_scale_prev) * (event.offsetX - object_offset_x);
    object_offset_y += (1.0 - object_scale / object_scale_prev) * (event.offsetY - object_offset_y);
    draw();
  }
  // 取消右键菜单
  canvas.oncontextmenu = e => e.preventDefault();
  // 鼠标按下事件处理
  canvas.onmousedown = (event: MouseEvent) => {
    if (event.button == 0) { // left
      mouse_select = true;
      select_1st_x = event.offsetX;
      select_1st_y = event.offsetY;
    }
    if (event.button == 2) { // right
      mouse_drag = true;
    }
  }
  // 鼠标抬起事件处理
  canvas.onmouseup = (event: MouseEvent) => {
    if (event.button == 0) { // left
      mouse_select = false;
      page_add_char(select_1st_x, select_1st_y, select_2nd_x, select_2nd_y);
    }
    if (event.button == 2) {// right
      mouse_drag = false;
    }
  }
  // 处理鼠标移动事件
  canvas.onmousemove = (event: MouseEvent) => {
    if (mouse_drag) {
      object_offset_x += event.movementX;
      object_offset_y += event.movementY;
      draw();
    }
    if (mouse_select && props.edit_mode) {
      select_2nd_x = event.offsetX;
      select_2nd_y = event.offsetY;
      draw();
    }
  }
  // 组件大小改变回调
  new ResizeObserver((events: ResizeObserverEntry[]) => {
    let event = events[0];
    canvas.width = event.contentRect.width;
    canvas.height = event.contentRect.height;
    draw();
  }).observe(document.getElementById("edit-canvas-container") as Element)
  // 设置图片加载回调
  page_image.onload = () => draw();

  // clear buffer
  canvas_clear_buffer();
}

onMounted(() => {
  set_image_url("/test.png");
  canvas_setup();
})

</script>

<template>
  <div class="relative w-full h-full bg-cyan-100">
    <!--显示区域-->
    <div id="edit-canvas-container" class="relative inline-block w-[44.44%] h-full">
      <canvas id="edit-canvas" width="300" height="300"/>
    </div>
    <!--按钮区域-->
    <div class="relative inline-block w-[11.11%] h-full bg-gray-200"></div>
    <!--字符编辑区域-->
    <div class="relative inline-block w-[44.44%] h-full"></div>
  </div>
</template>