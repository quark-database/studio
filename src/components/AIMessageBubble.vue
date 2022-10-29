<template lang="pug">
.ai-message-bubble(v-bind:class="senderType")
  span.text {{text}}
  span.ai-message-footer {{sender}}, {{time}}
</template>

<script>
export default {
  name: "AIMessageBubble",
  props: {
    senderType: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },

  computed: {
    sender: function() {
      return this.senderType === "you" ? "You" : "Quarkus AI";
    },

    time: function() {
      const now = new Date()
      return now.getHours() + ":" + now.getMinutes()
    }
  }
}
</script>

<style lang="sass">
@import "../assets/colors"

.ai-message-bubble
  display: flex
  flex-direction: column
  width: 20%
  border-radius: 5px
  padding: .5em 1em
  margin-top: 1em
  font-weight: 500
  animation: ai-message-bubble-fade-in-animation cubic-bezier(.21, 1.5, .2, .98) 500ms
  @keyframes ai-message-bubble-fade-in-animation
    from
      opacity: 0
      transform: translateX(500px) translateY(-20px) rotate(15deg) scale(2)
    to
      opacity: 1
      transform: translateX(0)
  .text
    word-wrap: break-word
  &.you
    background: $primary
    color: white
  &.ai
    background: $light
    color: black
  .ai-message-footer
    font-weight: 400
    font-style: italic
    font-size: .8em
    width: 100%
    margin-top: .4em
</style>