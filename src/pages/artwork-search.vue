<script setup lang="ts">
import {Search} from "@element-plus/icons-vue";
import {do_artwork_get_request} from "../api/artwork";

const do_search_request = () => {
  do_artwork_get_request({condition: ["where ti_ming LIKE ?"]})
}

</script>

<template>
  <div class="relative w-screen">
    <div class="absolute w-full h-32 top-0 left-0" style="background-image: url('/img/search-header-0.jpg');"></div>
    <div class="relative container max-w-4xl mx-auto">
      <!--头部-->
      <div class="relative h-32 py-8 px-8">
        <span class="relative text-6xl cursor-default font-msz select-none">作品搜索</span>
        <span class="absolute right-8 top-12">
          <input class="h-10 w-96 px-2 outline-0"
                 type="text"
                 placeholder="请输入搜索关键词"/>
          <span class="inline-block align-top ml-4 w-10 h-10
                      bg-white rounded-full hover:bg-[#f2f2f2] active:border
                      select-none cursor-pointer">
            <search class="inline-block w-6 h-6 mx-2 my-2"/>
          </span>
        </span>
      </div>
      <!--结果数和过滤器-->
      <div class="bg-white h-10 my-6 items-center px-2 py-2">
        <span
            class="inline-block h-6 w-36 align-middle text-center cursor-default">
          搜索结果({{  }})
        </span>
      </div>
      <div class="flex flex-wrap">
      </div>
    </div>
  </div>
</template>
