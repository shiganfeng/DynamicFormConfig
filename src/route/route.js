import { createRouter, createWebHashHistory } from "vue-router";

const history = createWebHashHistory();
const routes = [
    {
        path: "/",
        name: "layout",
        redirect: { name: 'functionMenu' },
        component: () => import("../views/layout/layout.vue"),
        children: [
            {
                path: "functionMenu",
                name: "functionMenu",
                component: () => import("../views/layout/functionMenu/functionMenu.vue"),
            },
            {
                path: "formConfig",
                name: "formConfig",
                component: () => import("../views/layout/formConfig/formConfig.vue"),
            },
            {
                path: "calendar",
                name: "calendar",
                component: () => import("../views/layout/calendar/calendar.vue"),
            },
            {
                path: "question",
                name: "question",
                component: () => import("../views/layout/question/question.vue"),
            },
            {
                path: "questionConfig",
                name: "questionConfig",
                component: () => import("../views/layout/questionConfig/questionConfig.vue"),
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