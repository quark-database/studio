<template lang="pug">
#sidebar-logo
  img#sidebar-logo-image(:src="logoPath")
</template>

<script>
export default {
  name: "SideBarLogo",
  data() {
    return {
      logoPath: 'icons/logo.svg'
    }
  }
}
</script>

<style lang="sass" scoped>
#sidebar-logo
  width: 100%
  display: flex
  justify-content: center
  align-items: center
  margin-bottom: 1em
  #sidebar-logo-image
    width: 80px
    height: auto
</style>