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

onMounted(() => {
  page_info.id = parseInt(route.params["id"] as string);
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
})
</script>

<template>
  <div v-loading="">callout</div>
</template>