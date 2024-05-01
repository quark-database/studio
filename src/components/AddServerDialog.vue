<template lang="pug">
#add-server-dialog(v-if="show")
  #add-server-dialog-form-container
    span#add-server-title
      img#add-server-icon(:src="iconSrc")
      |Connect to a server
    input#add-server-host(ref="host", v-model="host", placeholder="Host name")
    input#add-server-port(ref="port", v-model="port", placeholder="Port number")
    input#add-server-token(ref="token", v-model="token", placeholder="Access token", type="password")
    span#add-server-button(v-on:click="onAddServerButtonClicked") Connect
    span#add-server-cancel-button(v-on:click="onCancelButtonClicked") I've changed my mind
  img#add-server-image(:src="imageSrc")
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "AddServerDialog",

  data() {
    return {
      show: false,
      host: '',
      port: '',
      token: '',
      imageSrc: '../images/add-server.svg',
      iconSrc: '../icons/sidebar/servers.svg'
    }
  },

  methods: {
    onAddServerButtonClicked() {
      if(this.host === "") {
        this.$refs.host.classList.remove('bad')
        this.$refs.host.classList.add('bad')
      }

      if(this.port === "" || isNaN(this.port)) {
        this.$refs.port.classList.remove('bad')
        this.$refs.port.classList.add('bad')
      }

      if(this.token === "") {
        this.$refs.token.classList.remove('bad')
        this.$refs.token.classList.add('bad')
      }

      ipcRenderer.invoke('add-server', this.host, this.port, this.token).then(() => {
        this.show = false;
        this.$emit("server-added");

        this.host = '';
        this.port = '';
        this.token = '';
      })
    },

    onCancelButtonClicked() {
      this.show = false;
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/colors'

#add-server-dialog
  z-index: 999
  position: absolute
  display: flex
  left: 50%
  top: 50%
  transform: translateX(-50%) translateY(-50%)
  height: 350px
  background: white
  box-shadow: 2px 2px 25px #0004
  border-radius: 8px
  overflow: hidden
  padding-left: 3em
  width: 50vw
  animation: add-server-dialog-animation 400ms cubic-bezier(.18, 1.66, .66, 1)
  @keyframes add-server-dialog-animation
    from
      opacity: 0
      transform: scale(.4) rotate(-10deg) translateX(-70%) translateY(-70%)
    to
      opacity: 1
      transform: scale(1) translateX(-50%) translateY(-50%)
  #add-server-dialog-form-container
    display: flex
    justify-content: center
    flex-direction: column
    width: 50%
    margin-right: 10%
    #add-server-title
      font-weight: 700
      display: flex
      align-items: center
      text-align: left
      font-size: 24px
      margin-bottom: 1.25em
      #add-server-icon
        filter: invert(29%) sepia(97%) saturate(3290%) hue-rotate(204deg) brightness(104%) contrast(107%)
        width: .75em
        height: auto
        margin-right: .75em
    input
      padding: .75em 1.25em
      border-radius: 5px
      outline: none
      border: none
      width: 100%
      margin-bottom: .8em
      font-family: Gilroy, sans-serif
      transition: .3s
      box-shadow: 0 0 5px #0002
      &::placeholder
        color: $gray
      &.bad
        animation: bad-input-animation 500ms
        @keyframes bad-input-animation
          50%
            box-shadow: 0 0 15px $danger
    #add-server-button
      border-radius: 5px
      background: $primary
      width: 100%
      color: white
      padding: .75em 1.25em
      text-align: center
      margin-top: .4em
      cursor: pointer
      font-weight: 500
    #add-server-cancel-button
      color: $gray
      padding: 0 1.25em
      text-align: center
      margin-top: .8em
      width: 100%
      cursor: pointer
  #add-server-image
    width: 50%
    height: 100%
</style>