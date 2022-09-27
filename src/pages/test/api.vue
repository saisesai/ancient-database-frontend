<script setup lang="ts">
import {ElMessage} from "element-plus";
import {onMounted} from "vue";
import {debug} from "../../config";
import {useRouter} from "vue-router";
import {
  do_char_add_request,
  do_char_del_request,
  do_char_get_request,
  do_char_mod_request
} from "../../api/char";
import {
  do_page_add_request,
  do_page_del_request,
  do_page_get_request,
  do_page_mod_request
} from "../../api/page";
import {
  do_artwork_add_request,
  do_artwork_del_request,
  do_artwork_get_request,
  do_artwork_mod_request
} from "../../api/artwork";

const router = useRouter();

const test_char_add_1 = () => {
  do_char_add_request({page_id: 0, value: "test"})
      .then(resp => console.log(resp))
      .catch(err => console.log(err));
}

const test_char_add_2 = async () => {
  let out = await do_char_add_request({page_id: 0, value: "test"});
  console.log(out);
}

const test_char_del_1 = () => {
  do_char_del_request({id: 11})
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

const test_char_get_1 = () => {
  do_char_get_request({condition: []})
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

const test_char_mod_1 = () => {
  do_char_mod_request({id: 5, value: "test", region: {pos_x: 10, pos_y: 10, width: 20, height: 20}})
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

const test_page_add_1 = () => {
  do_page_add_request({artwork_id: 0})
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

const test_page_del_1 = () => {
  do_page_del_request({id: 8})
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

const test_page_get_1 = () => {
  do_page_get_request({condition: []})
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

const test_page_mod_1 = () => {
  do_page_mod_request({id: 8, image_url:"xxx"})
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

const test_artwork_add_1 = () => {
  do_artwork_add_request({})
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

const test_artwork_del_1 = () => {
  do_artwork_del_request({id: 3})
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

const test_artwork_get_1 = () => {
  do_artwork_get_request({condition: []})
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

const test_artwork_mod_1 = () => {
  do_artwork_mod_request({
    id: 1,
    cover: "123", ti_ming: "123", zang_nian: "123", chao_dai: "123", chu_tu_di: "123",
    xian_cang_di: "123", hang_zi_shu: "123", chi_cun: "123", shuo_ming: "123", zu_nian: "123",
    nian_ling: "123", xing_bie: "123", ji_guan: "123", zhi_gai: "123", ming_wen: "123",
  })
      .then(resp => console.log(resp))
      .catch(err => {
        console.log(err.response.data.msg);
      });
}

onMounted(() => {
  if (!debug) { // 检测环境
    router.push("/");
    ElMessage.error("非调试模式！");
  }
})

</script>

<template>
  <div class="text-center p-5 space-y-10">
    <div class="space-y-5">
      <div class="text-2xl text-3xl">字符接口测试</div>
      <el-button-group>
        <el-button @click="test_char_add_1">字符新增接口测试1</el-button>
        <el-button @click="test_char_add_2">字符新增接口测试2</el-button>
        <el-button @click="test_char_del_1">字符删除接口测试1</el-button>
        <el-button @click="test_char_get_1">字符获取接口测试1</el-button>
        <el-button @click="test_char_mod_1">字符修改接口测试1</el-button>
      </el-button-group>
    </div>
    <div class="space-y-5">
      <div class="text-3xl">页面接口测试</div>
      <el-button-group>
        <el-button @click="test_page_add_1">页面新增接口测试1</el-button>
        <el-button @click="test_page_del_1">页面删除接口测试1</el-button>
        <el-button @click="test_page_get_1">页面获取接口测试1</el-button>
        <el-button @click="test_page_mod_1">页面修改接口测试1</el-button>
      </el-button-group>
    </div>
    <div class="space-y-5">
      <div class="text-3xl">作品接口测试</div>
      <el-button-group>
        <el-button @click="test_artwork_add_1">作品新增接口测试1</el-button>
        <el-button @click="test_artwork_del_1">作品删除接口测试1</el-button>
        <el-button @click="test_artwork_get_1">作品获取接口测试1</el-button>
        <el-button @click="test_artwork_mod_1">作品修改接口测试1</el-button>
      </el-button-group>
    </div>
  </div>
</template>