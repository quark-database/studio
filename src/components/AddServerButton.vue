<template lang="pug">
img#add-server-button(:src="buttonImagePath", v-bind:class="{'pulsing': isPulsing}")
</template>

<script>
export default {
  name: "AddServerButton",
  data() {
    return {
      buttonImagePath: "/icons/server-page/add-server-button.svg",
      isPulsing: true,
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../assets/colors"

#add-server-button
  width: 30px
  height: auto
  cursor: pointer
  &.pulsing
    animation: add-server-button-animation infinite alternate-reverse 300ms ease-in-out
    @keyframes add-server-button-animation
      from
        transform: scale(.8)
      to
        transform: scale(1.3)
</style>