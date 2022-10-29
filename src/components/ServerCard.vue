<template lang="pug">
.server-card(v-bind:class="{ 'best-matched': bestMatched, 'not-matched': notMatched }", v-on:click="serverCardClicked")
  .header
    img.icon(:src="iconPath")
    span.title {{host}}
    .button-container
      img.delete-button(:src="deleteButtonSrc", title="Click to delete the server from this list", v-on:click="onDeleteButtonClick")
  .status
    .indicator(v-bind:class="statusTag")
    span.title {{statusTitle}}
</template>

<script>
import {ipcRenderer} from "electron";
import {playSound} from "@/scripts/web/play-sound";

export default {
  name: "ServerCard",
  props: {
    host: String,
    port: Number,
    token: String,
    status: String,
    bestMatched: Boolean,
    notMatched: Boolean,
  },

  mounted() {
    this.updateServerStatus();
  },

  data() {
    return {
      statusTag: this.status,
      statusTitle: 'Trying to connect...',
      iconPath: 'icons/sidebar/servers.svg',
      editButtonSrc: 'icons/edit.svg',
      deleteButtonSrc: 'icons/delete.svg',
    }
  },

  methods: {
    updateServerStatus() {
      ipcRenderer.invoke('check-connection', this.host, this.port, this.token).then(status => {
        this.statusTag = status;

        switch(status) {
          case "online":
            this.statusTitle = "Online";
            break;
          case "offline":
            this.statusTitle = "Offline";
            break;
          case "bad-token":
            this.statusTitle = "Bad token";
            break;
          default:
            this.statusTitle = "Unknown status";
        }
      })
    },

    onDeleteButtonClick() {
      ipcRenderer.invoke('delete-server', this.host, this.port, this.token).then(() => {
        this.$emit('server-card-deleted')
      })
    },

    serverCardClicked() {

      if(this.statusTag === 'online') {
        this.$emit('server-card-clicked', this)
        playSound('server-connected')
      }
    },

    isOffline() {
      return this.status !== 'online'
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
  margin-right: 15px
  transition: 300ms transform cubic-bezier(.18, 1.66, .66, 1)
  backface-visibility: hidden
  -webkit-font-smoothing: subpixel-antialiased
  cursor: pointer
  user-select: none
  &.offline
    cursor: not-allowed
    opacity: .3
  &:not(.offline):active
    animation: server-card-click-animation 150ms cubic-bezier(.18, 1.66, .66, 1)
    @keyframes server-card-click-animation
      30%
        transform: scale(.95)
  &.best-matched
    transform: scale(1.2) translateZ(0)
    border: $primary 1px solid
    &.header
      color: $primary
  &.not-matched
    transform: scale(.9)
    opacity: .75
    filter: blur(3px)
  .header
    display: flex
    align-items: center
    width: 100%
    .icon
      width: .7em
      filter: invert(29%) sepia(97%) saturate(3290%) hue-rotate(204deg) brightness(104%) contrast(107%)
      margin-right: 1em
    .title
      font-weight: 600
    .button-container
      margin-left: auto
      display: flex
      gap: .25em
      .edit-button, .delete-button
        cursor: pointer
        width: .8em
        height: .8em
  .status
    display: flex
    flex-direction: row
    align-items: center
    .indicator
      width: 5px
      height: 5px
      border-radius: 50rem
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