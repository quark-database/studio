<template lang="pug">
#ai-chat-loading-bar
  #ai-chat-loading-bar-spinner
  span#ai-chat-loading-bar-title Quarkus AI is typing...
</template>

<script>
export default {
  name: "AIChatLoadingBar"
}
</script>

<style lang="sass" scoped>
@import "@/assets/colors.sass"

#ai-chat-loading-bar
  display: flex
  width: 100%
  margin-top: 1em
  align-items: center
  #ai-chat-loading-bar-spinner
    width: 5px
    height: 5px
    border-radius: 50rem
    margin-right: 1em
    border-left: $primary 2px solid
    border-right: $semi-primary 2px solid
    background-color: white
    animation: ai-chat-loading-bar-spinner-animation .55s infinite ease-in-out
    @keyframes ai-chat-loading-bar-spinner-animation
      from
        transform: rotate(0)
      50%
        transform: rotate(360deg) scale(2)
      to
        transform: rotate(720deg)
  #ai-chat-loading-bar-title
    color: $gray
    font-weight: 500
    animation: ai-chat-loading-bar-title-animation 2s infinite ease-in-out
    @keyframes ai-chat-loading-bar-title-animation
      50%
        color: darken($gray, 20%)
</style>