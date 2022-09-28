<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {
  api_page_mod_input,
  api_page_output,
  do_page_get_request, do_page_mod_request,
} from "../api/page";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const route = useRoute();
const router = useRouter();
const page_loading = ref<boolean>(false);
const artwork_id = ref<number>(0);
const page_info = reactive<api_page_mod_input>({
  id: 0,
  image_url: "",
})

const btn_save_page_info_cb = () => {
  page_loading.value = true;
  do_page_mod_request(page_info)
      .then(() => {
        page_loading.value = false;
        ElMessage.success("保存作品成功");
      })
      .catch(err => {
        page_loading.value = false;
        ElMessage.error(err.response.data.msg);
      })
}

const btn_enter_char_callout_page_cb = () => router.push("/page/callout/"+ page_info.id.toString());

const btn_back_to_artwork_edit_cb = () => router.push("/artwork/edit/" + artwork_id.value.toString());

onMounted(() => {
  page_info.id = parseInt(route.params["id"] as string);
  page_loading.value = true;
  do_page_get_request({condition: [page_info.id]})
      .then(resp => {
        page_loading.value = false;
        artwork_id.value = resp.data[0].artwork_id;
        page_info.image_url = resp.data[0].image_url;
      })
      .catch(err => {
        page_loading.value = false;
        ElMessage.error(err.response.data.msg);
        router.push("/");
      });
})

</script>

<template>
  <div class="container max-w-3xl mx-auto p-6 space-y-6" v-loading="page_loading">
    <!--标题-->
    <div class="text-3xl">编辑页面: {{ page_info.id }}</div>

    <!--页面信息表单-->
    <el-form label-position="top">
      <el-row>
        <el-col :span="24">
          <el-form-item label="页面图片URL地址">
            <el-input v-model="page_info.image_url"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!--按钮-->
    <div>
      <el-button type="success" @click="btn_save_page_info_cb">保存页面信息</el-button>
      <el-button type="primary" @click="btn_enter_char_callout_page_cb">进入字符标注页面</el-button>
      <el-button @click="btn_back_to_artwork_edit_cb">返回作品编辑</el-button>
    </div>
  </div>
</template>