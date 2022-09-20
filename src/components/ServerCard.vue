<template lang="pug">
.server-card
  .header
    img.icon(:src="iconPath")
    span.title {{host}}
  .status
    .indicator(v-bind:class="status")
    span.title {{statusTitle}}
</template>

<script>
export default {
  name: "ServerCard",
  props: {
    host: String,
    port: Number,
    token: String,
    status: String
  },

  data() {
    return {
      // status: 'waiting',
      statusTitle: 'Trying to connect...',
      iconPath: 'icons/sidebar/servers.svg'
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/colors'

.server-card
  background: white
  border-radius: 5px
  padding: 1em
  font-family: Gilroy, sans-serif
  display: flex
  flex-direction: column
  width: 15%
  .header
    display: flex
    align-items: center
    .icon
      width: .7em
      filter: invert(29%) sepia(97%) saturate(3290%) hue-rotate(204deg) brightness(104%) contrast(107%)
      margin-right: 1em
    .title
      font-weight: 600
  .status
    display: flex
    flex-direction: row
    align-items: center
    .indicator
      width: 5px
      height: 5px
      border-radius: 50rem
      background-color: red
      margin-right: 1em
      &.waiting
        border-left: $primary 2px solid
        border-right: $semi-primary 2px solid
        background-color: white
        animation: indicator-spin-animation .55s infinite ease-in-out
        @keyframes indicator-spin-animation
          from
            transform: rotate(0)
          50%
            transform: rotate(360deg) scale(2)
          to
            transform: rotate(720deg)
      &.online
        background: $success
        box-shadow: 0 0 5px $success
      &.offline
        background: $gray
      &.bad-token
        background: $danger
        box-shadow: 0 0 5px $danger
        animation: bad-token-indicator-blink-animation 200ms alternate infinite ease-in-out
        @keyframes bad-token-indicator-blink-animation
          from
            background: $danger
            box-shadow: 0 0 5px $danger
          to
            background: $gray
            box-shadow: 0 0 0 transparent
    .title
      font-weight: 400
      color: $gray
</style>