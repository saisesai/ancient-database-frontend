<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {api_page_output, do_page_get_request} from "../api/page";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import Callout from "../components/callout.vue";

const route = useRoute()
const router = useRouter();
const page_loading = ref<boolean>(false);
const page_info = reactive<api_page_output>({
  id: 0, created_at: "", updated_at: "", artwork_id: 0, image_url: "", chars: []
})
const callout_ref = ref();

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

const callout_set_page_now = (pId: number) => {
  callout_ref.value.set_page_now(pId);
}

onMounted(() => {
  page_info.id = parseInt(route.params["id"] as string);
  setup_page_info();
  callout_set_page_now(page_info.id);
})
</script>

<template>
  <div class="h-screen" v-loading="page_loading">
    <callout ref="callout_ref" :edit_mode="true"/>
  </div>
</template>