import { createRouter, createWebHashHistory } from "vue-router";

const history = createWebHashHistory();
const routes = [
    {
        path: "/",
        name: "layout",
        redirect: { name: 'formConfig' },
        component: () => import("../views/layout/layout.vue"),
        children: [
            {
                path: "formConfig",
                name: "formConfig",
                component: () => import("../views/layout/formConfig/formConfig.vue"),
            }
        ]
    }
];

const router = createRouter({
    history,
    routes
})

router.beforeEach((to, from, next) => {
    next();
})

export default router