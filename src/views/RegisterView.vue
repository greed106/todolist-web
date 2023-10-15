<template>
    <div class="register-container">
        <UserRegister />
    </div>
</template>

<script>
import UserRegister from '@/components/UserRegister.vue'

export default {
    name: 'RegisterView',
    components: {
        UserRegister
    }
}
</script>