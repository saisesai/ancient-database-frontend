<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {api_page_output, do_page_get_request} from "../api/page";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const route = useRoute()
const router = useRouter();
const page_loading = ref<boolean>(false);
const page_info = reactive<api_page_output>({
  id: 0, created_at: "", updated_at: "", artwork_id: 0, image_url: "", chars: []
})

const setup_page_info = () => {
  page_loading.value = true;
  do_page_get_request({condition: [page_info.id]})
      .then(resp => {
        if (resp.data[0].image_url == "") {
          ElMessage.error("页面未保存图片URL！");
          page_loading.value = false;
          router.push("/page/edit/" + page_info.id);
          return
        }
        page_info.id = resp.data[0].id;
        page_info.created_at = resp.data[0].created_at;
        page_info.updated_at = resp.data[0].updated_at;
        page_info.artwork_id = resp.data[0].artwork_id;
        page_info.image_url = resp.data[0].image_url;
        page_info.chars = resp.data[0].chars;
        page_loading.value = false;
      })
      .catch(err => {
        ElMessage.error(err.response.data.msg)
        page_loading.value = false;
        router.push("/page/edit/" + page_info.id);
      })
}

let object_offset_x = 0;
let object_offset_y = 0;
let object_scale_prev = 1.0;
let object_scale = 1.0;
const page_image = new Image();
let canvas: HTMLCanvasElement;
page_image.src = "/test.png"
page_image.onload = () => draw();
let ctx: CanvasRenderingContext2D;
let mouse_drag = false;

const draw = () => {
  ctx.fillRect(0, 0, 300, 300);
  // draw image
  ctx.drawImage(page_image, object_offset_x, object_offset_y, 192 * object_scale, 192 * object_scale);
}

const setup_canvas = () => {
  canvas = document.getElementById("edit-canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 300, 300);
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
  canvas.oncontextmenu = e => e.preventDefault();
  canvas.onmousedown = (event: MouseEvent) => {
    if (event.button == 2) { // right
      mouse_drag = true;
    }
  }
  canvas.onmouseup = (event: MouseEvent) => {
    if (event.button == 2) {// right
      mouse_drag = false;
    }
  }
  canvas.onmousemove = (event: MouseEvent) => {
    if (mouse_drag) {
      object_offset_x += event.movementX;
      object_offset_y += event.movementY;
    }
    draw();
  }
}

onMounted(() => {
  page_info.id = parseInt(route.params["id"] as string);
  setup_canvas();
})
</script>

<template>
  <div class="bg-gray-200" v-loading="page_loading">
    <canvas class="mx-auto" id="edit-canvas" width="300" height="300"/>
    <div style="height: 9999px"></div>
  </div>
</template>