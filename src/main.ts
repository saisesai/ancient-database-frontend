import {createApp} from 'vue';
import './style.css';
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";
import App from './app.vue';
import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("./pages/home.vue"),
    },
    {
        path: "/artwork/new",
        name: "artwork-new",
        component: () => import("./pages/artwork-new.vue"),
    },
    {
        path: "/artwork/search",
        name: "artwork-search",
        component: () => import("./pages/artwork-search.vue"),
    },
    {
        path: "/artwork/edit/:id",
        name: "artwork-edit",
        component: () => import("./pages/artwork-edit.vue"),
    },
    {
        path: "/page/edit/:id",
        name: "page-edit",
        component: () => import("./pages/page-edit.vue"),
    },
    {
        path: "/page/callout/:id",
        name: "page-callout",
        component: () => import("./pages/page-callout.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () => import("./pages/not-found.vue"),
    },
    {
        path: "/test/api",
        name: "test-api",
        component: () => import("./pages/test/api.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);

app.use(router);

app.mount('#app');
