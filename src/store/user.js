import { defineStore } from "pinia";
import { ref, readonly } from 'vue';
import { MyCache } from "../utils/cache.js";

export const useUserStore = defineStore('user', () => {
    function createBaseState() {
        return {
            userId: '',
            userName: '',
            roleId: '',
            token: ''
        }
    }

    const userState = ref(createBaseState());
    new MyCache('VUE_APP_USER', userState.value);

    const userStateReadonly = readonly(userState);

    const setUserState = (value) => {
        Object.assign(userState.value, value);
    };

    const resetUserState = () => {
        Object.assign(userState.value, createBaseState());
    };

    return {
        userStateReadonly,
        setUserState,
        resetUserState
    }
});