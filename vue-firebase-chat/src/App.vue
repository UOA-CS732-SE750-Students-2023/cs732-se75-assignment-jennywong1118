<template>
  <NavView />
  <ChatView />
</template>

<script>
import "@/assets/main.css";
import NavView from '@/components/NavView.vue'
import ChatView from '@/components/ChatView.vue'

export default {
  name: 'App',
  components: { NavView, ChatView }
}
</script>