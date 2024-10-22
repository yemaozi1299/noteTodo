<template>
  <div>
	
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive>
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'layoutIndex',
  components: {},
  computed: {
    key() {
      return this.$route.path
    }
  },

  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', {
        withoutAnimation: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
