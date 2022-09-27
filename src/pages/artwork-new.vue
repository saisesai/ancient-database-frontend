<script setup lang="ts">
import {reactive, ref} from "vue";
import {api_artwork_mod_input, do_artwork_add_request, do_artwork_mod_request} from "../api/artwork";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const page_loading = ref<boolean>(false);

const artwork_info = reactive<api_artwork_mod_input>({
  id: 0, cover: "", ti_ming: "", zang_nian: "", chao_dai: "",
  chu_tu_di: "", xian_cang_di: "", hang_zi_shu: "", chi_cun: "",
  shuo_ming: "", zu_nian: "", nian_ling: "", xing_bie: "",
  ji_guan: "", zhi_gai: "", ming_wen: "",
})

// 新建作品按钮回调
const btn_new_artwork_cb = () => {
  page_loading.value = true;
  do_artwork_add_request({})
      .then(resp => {
        artwork_info.id = resp.data.id;
        do_artwork_mod_request(artwork_info)
            .then(() => {
              ElMessage.success("添加作品成功！");
              router.push("/artwork/edit/" + artwork_info.id.toString());
            })
            .catch(err => {
              page_loading.value = false;
              ElMessage.error(err.response.data.msg);
            })
      })
      .catch(err => {
        page_loading.value = false;
        ElMessage.error(err.response.data.msg);
      })
}

</script>

<template>
  <div class="relative container max-w-2xl mx-auto p-6 space-y-6" v-loading="page_loading">
    <!--标题-->
    <div class="relative text-3xl">新建作品</div>
    <!--表单-->
    <el-form label-position="top">
      <el-row>
        <el-col :span="24">
          <el-form-item label="封面URL">
            <el-input v-model="artwork_info.cover"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="题名">
            <el-input v-model="artwork_info.ti_ming"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="葬年">
            <el-input v-model="artwork_info.zang_nian"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="朝代">
            <el-input v-model="artwork_info.chao_dai"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="出土地">
            <el-input v-model="artwork_info.chu_tu_di"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="现藏地">
            <el-input v-model="artwork_info.xian_cang_di"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="行字数">
            <el-input v-model="artwork_info.hang_zi_shu"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="尺寸">
            <el-input v-model="artwork_info.chi_cun"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="说明">
            <el-input v-model="artwork_info.shuo_ming"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="卒年">
            <el-input v-model="artwork_info.zu_nian"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="年龄">
            <el-input v-model="artwork_info.nian_ling"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="性别">
            <el-input v-model="artwork_info.xing_bie"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="籍贯">
            <el-input v-model="artwork_info.ji_guan"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="志盖">
            <el-input autosize type="textarea" v-model="artwork_info.zhi_gai"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="铭文">
            <el-input autosize type="textarea" v-model="artwork_info.ming_wen"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--按钮-->
    <el-button class="relative" type="success" @click="btn_new_artwork_cb">新建作品</el-button>
  </div>
</template>
