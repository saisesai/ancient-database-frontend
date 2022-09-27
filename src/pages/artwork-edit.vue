<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {
  api_artwork_mod_input,
  api_artwork_output,
  do_artwork_get_request,
  do_artwork_mod_request,
} from "../api/artwork";
import {
  api_page_output,
  do_page_add_request,
  do_page_get_request,
  do_page_del_request,
} from "../api/page";
import {ElMessage} from "element-plus";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const page_loading = ref<boolean>(false);
const pages_table_loading = ref<boolean>(false);
let page_table_data = reactive<api_page_output[]>([]);

const artwork_info = reactive<api_artwork_mod_input>({
  id: 0, cover: "", ti_ming: "", zang_nian: "", chao_dai: "",
  chu_tu_di: "", xian_cang_di: "", hang_zi_shu: "", chi_cun: "",
  shuo_ming: "", zu_nian: "", nian_ling: "", xing_bie: "",
  ji_guan: "", zhi_gai: "", ming_wen: "",
});

// 新建作品按钮回调
const btn_mod_artwork_cb = () => {
  page_loading.value = true;
  do_artwork_mod_request(artwork_info)
      .then(() => {
        page_loading.value = false;
        ElMessage.success("添加作品成功！");
      })
      .catch(err => {
        page_loading.value = false;
        ElMessage.error(err.response.data.msg);
      })
}

const organize_info = (data_in: api_artwork_output, data_out: api_artwork_mod_input) => {
  data_out.cover = data_in.cover;
  data_out.ti_ming = data_in.ti_ming;
  data_out.zang_nian = data_in.zang_nian;
  data_out.chao_dai = data_in.chao_dai;
  data_out.chu_tu_di = data_in.chu_tu_di;
  data_out.xian_cang_di = data_in.xian_cang_di;
  data_out.hang_zi_shu = data_in.hang_zi_shu;
  data_out.chi_cun = data_in.chi_cun;
  data_out.shuo_ming = data_in.shuo_ming;
  data_out.zu_nian = data_in.zu_nian;
  data_out.nian_ling = data_in.nian_ling;
  data_out.xing_bie = data_in.xing_bie;
  data_out.ji_guan = data_in.ji_guan;
  data_out.zhi_gai = data_in.zhi_gai;
  data_out.ming_wen = data_in.ming_wen;
}

const btn_add_page_cb = () => {
  pages_table_loading.value = true;
  do_page_add_request({artwork_id: artwork_info.id})
      .then(resp => {
        pages_table_loading.value = false;
        page_table_data.push(resp.data)
      })
      .catch(err => {
        pages_table_loading.value = false;
        ElMessage.error(err.response.data.msg);
      })
}

const btn_del_page_cb = (id: number) => {
  do_page_del_request({id: id})
      .then(() => {
        for (let i in page_table_data)
          if (page_table_data[i].id == id)
            page_table_data.splice(Number(i), 1)
      })
      .catch(err =>{
        ElMessage.error(err.response.data.msg);
      })
}

onMounted(() => {
  // 获取作品id
  artwork_info.id = parseInt(route.params["id"] as string)

  page_loading.value = true;
  do_artwork_get_request({condition: [artwork_info.id]})
      .then(async resp => {
        // 整理作品信息
        organize_info(resp.data[0], artwork_info);
        // 获取页面信息
        for (let n in resp.data[0].pages) {
          await do_page_get_request({condition: [resp.data[0].pages[n]]})
              .then(resp => {
                page_table_data.push(resp.data[0]);
              })
              .catch(err => {
                ElMessage.error(err.response.data.msg);
              })
        }
        page_loading.value = false;
      })
      .catch(err => {
        ElMessage.error(err.response.data.msg);
        router.push("/");
      })
})

</script>

<template>
  <div class="container max-w-3xl mx-auto p-6 space-y-6" v-loading="page_loading">
    <!--标题-->
    <div class="text-3xl">编辑作品: {{ artwork_info.id }}</div>
    <!--基础信息表单-->
    <div class="space-y-4">
      <div class="text-2xl">基础信息</div>
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
    </div>

    <!--页面管理-->
    <div class="h-12 h-auto" v-loading="pages_table_loading">
      <div>
        <span class="text-2xl">页面管理</span>
        <el-button class="float-right m-2" type="primary" @click="btn_add_page_cb">添加空页面</el-button>
      </div>
      <!--页面信息列表-->
      <el-table :data="page_table_data">
        <el-table-column width="80" prop="id" label="全局ID"/>
        <el-table-column label="创建时间">
          <template #default="scope">
            {{ (new Date(scope.row.created_at)).toString() }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template #default="scope">
            {{ (new Date(scope.row.updated_at)).toString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small">编辑</el-button>
            <el-button type="danger" size="small" @click="btn_del_page_cb(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--按钮-->
    <div>
      <el-button type="success" @click="btn_mod_artwork_cb">保存修改</el-button>
    </div>
  </div>
</template>
