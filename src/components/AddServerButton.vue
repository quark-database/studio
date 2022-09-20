<template lang="pug">
img#add-server-button(:src="buttonImagePath")
</template>

<script>
export default {
  name: "AddServerButton",
  data() {
    return {
      buttonImagePath: "/icons/server-page/add-server-button.svg",
    }
  }
}
</script>

<style lang="sass" scoped>
#add-server-button
  width: 30px
  height: auto
  cursor: pointer
</style>