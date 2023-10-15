<template>
    <div class="login-container">
        <!-- 使用 UserLogin 组件 -->
        <UserLogin />
    </div>
</template>

<script>
import UserLogin from '@/components/UserLogin.vue'

export default {
    name: 'LoginView',
    components: {
        UserLogin
    }
}
</script>
