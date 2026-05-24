import { ref } from 'vue'

const visible = ref(false)
const initialView = ref<'login' | 'register'>('login')

export function useAuthModal() {
    function open(view: 'login' | 'register' = 'login') {
        initialView.value = view
        visible.value = true
    }

    function close() {
        visible.value = false
    }

    return { visible, initialView, open, close }
}
