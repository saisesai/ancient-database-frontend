<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {do_page_get_request} from "../api/page";
import {Action, ElMessage, ElMessageBox} from "element-plus";
import {Region} from "../api/region";
import {do_char_add_request, do_char_del_request, do_char_get_request, do_char_mod_request} from "../api/char";
import {useRouter} from "vue-router";

const router = useRouter();

type callout_char_t = {
  id: number;
  value: string;
  region: Region
  saved: boolean;
  triggered: boolean;
  displayed: boolean;
}

const props = defineProps({
  edit_mode: {type: Boolean, required: true},
})

let page_id = 0;
let object_offset_x = 0;
let object_offset_y = 0;
let object_scale_prev = 1.0;
let object_scale = 1.0;
const page_image = new Image();
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let dragging = false;
let selecting = false;
let select_1st_x = 0.0;
let select_1st_y = 0.0;
let select_2nd_x = 0.0;
let select_2nd_y = 0.0;
let component_loading = ref<boolean>(true);
const chars_list = reactive<callout_char_t[]>([]);
let trigger_mode = ref<boolean>(true);

const set_page_now = (p_page_id: number) => {
  component_loading.value = true;
  chars_list.splice(0, chars_list.length);
  do_page_get_request({condition: [p_page_id]})
      .then(async resp => {
        let qr = resp.data[0];
        page_id = qr.id;
        if (qr.chars) {
          for (let i in qr.chars) {
            // todo 数据获取优化
            await do_char_get_request({condition: [qr.chars[i]]})
                .then(resp => {
                  let qr = resp.data[0];
                  let char_new: callout_char_t = {
                    id: qr.id,
                    value: qr.value,
                    region: qr.region,
                    saved: true,
                    triggered: false,
                    displayed: false,
                  }
                  chars_list.push(char_new);
                })
                .catch(err => {
                  ElMessage.error(err.response.data.msg);
                })
          }
        }
        canvas_load_image(qr.image_url);
        component_loading.value = false;
      })
      .catch(err => {
        ElMessage.error(err.response.data.msg);
        component_loading.value = false;
      })
}

const region_now_2_ori = (p_region_now: Region): Region => {
  let ori_out: Region = {pos_x: 0, pos_y: 0, width: 0, height: 0}
  ori_out.width = p_region_now.width / object_scale;
  ori_out.height = p_region_now.height / object_scale;
  ori_out.pos_x = (p_region_now.pos_x - object_offset_x) / object_scale;
  ori_out.pos_y = (p_region_now.pos_y - object_offset_y) / object_scale;
  return ori_out;
}

const region_ori_2_now = (p_region_ori: Region): Region => {
  let now_out: Region = {pos_x: 0, pos_y: 0, width: 0, height: 0}
  now_out.width = p_region_ori.width * object_scale;
  now_out.height = p_region_ori.height * object_scale;
  now_out.pos_x = p_region_ori.pos_x * object_scale + object_offset_x;
  now_out.pos_y = p_region_ori.pos_y * object_scale + object_offset_y;
  return now_out;
}

const is_pos_in_region = (px: number, py: number, p_region: Region): boolean =>
    (px >= p_region.pos_x
        && px <= p_region.pos_x + p_region.width
        && py >= p_region.pos_y
        && py <= p_region.pos_y + p_region.height)

const page_add_char = (px1: number, py1: number, px2: number, py2: number) => {
  let char_new = {
    id: 0,
    value: "",
    region: region_now_2_ori({
      pos_x: px1,
      pos_y: py1,
      width: px2 - px1,
      height: py2 - py1,
    }),
    saved: false,
    triggered: false,
    displayed: false,
  };
  chars_list.push(char_new);
}

const canvas_load_image = (image_url: string) => {
  component_loading.value = true;
  page_image.src = image_url;
}

const canvas_clear_buffer = () => {
  ctx.save();
  ctx.fillStyle = "#cccccc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

const canvas_draw_selecting = (p_region: Region) => {
  ctx.save();
  ctx.strokeStyle = "aqua";
  ctx.lineWidth = 2;
  ctx.strokeRect(p_region.pos_x, p_region.pos_y, p_region.width, p_region.height);
  ctx.restore()
}

const canvas_draw_trigger = (p_region: Region) => {
  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.strokeRect(p_region.pos_x, p_region.pos_y, p_region.width, p_region.height);
  ctx.restore();
}

const canvas_draw_display = (p_region: Region) => {
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(p_region.pos_x, p_region.pos_y, p_region.width, p_region.height);
  ctx.restore();
}

const canvas_draw_normal = (p_region: Region) => {
  ctx.save();
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.strokeRect(p_region.pos_x, p_region.pos_y, p_region.width, p_region.height);
  ctx.restore();
}

const draw = () => {
  ctx.save();
  // clear buffer
  canvas_clear_buffer();
  // draw image
  ctx.drawImage(page_image, object_offset_x, object_offset_y, page_image.width * object_scale, page_image.height * object_scale);

  // 触发模式显示
  if (trigger_mode.value) {
    chars_list.forEach(char => {
      if (char.triggered) canvas_draw_trigger(region_ori_2_now(char.region))
    })
  } else {
    chars_list.forEach(char => canvas_draw_normal(region_ori_2_now(char.region)))
  }

  // 编辑模式
  if (props.edit_mode) {
    // 显示选择范围
    if (selecting) {
      canvas_draw_selecting({
        pos_x: select_1st_x,
        pos_y: select_1st_y,
        width: select_2nd_x - select_1st_x,
        height: select_2nd_y - select_1st_y,
      });
    }
    // 直接显示字符
    chars_list.forEach(char => {
      if (char.displayed) canvas_draw_display(region_ori_2_now(char.region))
    })
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
    if (event.button == 0 && props.edit_mode) { // left
      selecting = true;
      select_1st_x = event.offsetX;
      select_1st_y = event.offsetY;
    }
    if (event.button == 2) { // right
      dragging = true;
    }
  }
  // 鼠标抬起事件处理
  canvas.onmouseup = (event: MouseEvent) => {
    if (event.button == 0 && props.edit_mode) { // left
      selecting = false;
      if (select_1st_x < select_2nd_x && select_1st_y < select_2nd_y) {
        page_add_char(select_1st_x, select_1st_y, select_2nd_x, select_2nd_y);
      }
    }
    if (event.button == 2) {// right
      dragging = false;
    }
  }
  // 处理鼠标移动事件
  canvas.onmousemove = (event: MouseEvent) => {
    if (dragging) {
      object_offset_x += event.movementX;
      object_offset_y += event.movementY;
      draw();
    }
    if (selecting && props.edit_mode) {
      select_2nd_x = event.offsetX;
      select_2nd_y = event.offsetY;
      draw();
    }
    if (trigger_mode.value) {
      let should_update = false;
      chars_list.forEach(char => {
        if (is_pos_in_region(event.offsetX, event.offsetY, region_ori_2_now(char.region))) {
          if (!char.triggered) {
            should_update = true;
            char.triggered = true;
          }
        } else {
          if (char.triggered) {
            should_update = true;
            char.triggered = false;
          }
        }
      });
      if (should_update) draw();
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
  page_image.onload = () => {
    object_scale = canvas.width / page_image.width;
    draw();
    component_loading.value = false;
  }

  // clear buffer
  canvas_clear_buffer();
}

const input_char_change_cb = (char: callout_char_t) => {
  char.saved = false;
}

const btn_char_save_cb = (char: callout_char_t) => {
  component_loading.value = true;
  if (char.id == 0) {
    do_char_add_request({page_id: page_id, value: char.value})
        .then(resp => {
          char.id = resp.data.id;
          do_char_mod_request({id: char.id, value: char.value, region: char.region})
              .then(() => {
                component_loading.value = false;
                char.saved = true;
                ElMessage.success("保存成功！");
              })
              .catch(err => {
                ElMessage.error(err.response.data.msg);
                component_loading.value = false;
              })
        })
        .catch(err => {
          ElMessage.error(err.response.data.msg);
          component_loading.value = false;
        })
  } else {
    do_char_mod_request({id: char.id, value: char.value, region: char.region})
        .then(() => {
          component_loading.value = false;
          char.saved = true;
          ElMessage.success("保存成功！");
        })
        .catch(err => {
          ElMessage.error(err.response.data.msg);
          component_loading.value = false;
        })
  }
}

const btn_char_delete_cb = (char: callout_char_t) => {
  component_loading.value = true;
  if (char.saved) {
    do_char_del_request({id: char.id})
        .then(() => {
          ElMessage.success("删除成功！");
          component_loading.value = false;
          for (let i in chars_list) {
            if (chars_list[i] == char) {
              chars_list.splice(Number(i), 1);
              return
            }
          }
        })
        .catch(err => {
          ElMessage.error(err.response.data.msg);
          component_loading.value = false;
        })
  } else {
    component_loading.value = false;
    for (let i in chars_list) {
      if (chars_list[i] == char) {
        chars_list.splice(Number(i), 1);
        return
      }
    }
  }
}

const btn_back_page_info = () => {
  let has_unsaved = false;
  chars_list.forEach(char => {
    if (!char.saved) {
      has_unsaved = true;
    }
  })
  if (has_unsaved) {
    ElMessageBox.alert("内容未全部保存！请保存未保存内容！", "警告", {
      confirmButtonText: "好的",
      type: "warning"
    })
    return
  }
  router.push("/page/edit/" + page_id.toString());
}

onMounted(() => {
  canvas_setup();
})

defineExpose({
  set_page_now
})
</script>

<template>
  <div class="relative w-full h-full overflow-hidden" v-loading="component_loading">
    <!--显示区域-->
    <div id="edit-canvas-container"
         class="relative inline-block  h-full"
         :class="{'w-[44.44%]': edit_mode, 'w-4/5': !edit_mode}">
      <canvas id="edit-canvas" width="300" height="300"/>
    </div>

    <!--按钮区域-->
    <div class="relative w-[11.11%] h-full bg-slate-100 border-x-2 border-black
                inline-flex align-top flex-col items-center justify-evenly"
         :class="{'w-11.11%]': edit_mode, 'w-1/5': !edit_mode}">
      <div @click="trigger_mode=true;draw();" v-if="!trigger_mode">
        <el-button>触发显示</el-button>
      </div>
      <div @click="trigger_mode=false;draw();" v-if="trigger_mode">
        <el-button>全局显示</el-button>
      </div>
      <div @click="btn_back_page_info()" v-if="edit_mode">
        <el-button>返回信息编辑</el-button>
      </div>
    </div>

    <!--字符编辑区域-->
    <div class="relative inline-block w-[44.44%] h-full align-top overflow-auto" v-if="edit_mode">
      <el-table :data="chars_list" stripe>
        <el-table-column label="全局ID" prop="id" align="center" width="120"/>
        <el-table-column label="区域" align="center" width="240">
          <template #default="scope">
            [{{ scope.row.region.pos_x.toFixed(0) }}
            | {{ scope.row.region.pos_x.toFixed(0) }}
            | {{ scope.row.region.width.toFixed(0) }}
            | {{ scope.row.region.height.toFixed(0) }}]
          </template>
        </el-table-column>
        <el-table-column label="字符" align="center" width="100">
          <template #default="scope">
            <el-input v-model="scope.row.value" maxlength="1" @change="input_char_change_cb(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button-group>
              <el-button type="primary" @click="scope.row.displayed=true;draw()" v-if="!scope.row.displayed">显示
              </el-button>
              <el-button @click="scope.row.displayed=false;draw()" v-if="scope.row.displayed">隐藏</el-button>
              <el-button type="success" v-if="!scope.row.saved" @click="btn_char_save_cb(scope.row)">保存</el-button>
              <el-button type="danger" @click="btn_char_delete_cb(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>