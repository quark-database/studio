<template lang="pug">
input#server-search-bar(v-on:input="onKeyDown", v-model="content", placeholder="Enter a host name or IP to search for...")
</template>

<script>
import {sleep} from "@/scripts/web/sleep";
import {playSound} from "@/scripts/web/play-sound";

export default {
  name: "ServerSearchBar",
  data() {
    return {
      content: "",
    }
  },

  methods: {
    async onKeyDown() {
      playSound("typing")
      document.getElementById("server-search-bar").classList.remove("playing-keypress-animation")
      document.getElementById("server-search-bar").classList.add("playing-keypress-animation")
      await sleep(100);
      document.getElementById("server-search-bar").classList.remove("playing-keypress-animation")

      this.$emit("key-pressed", this.content)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../assets/colors"

#server-search-bar
  outline: none
  border-radius: 5px
  box-shadow: 0 0 15px adjust-color($primary, $alpha: -.87)
  border: none
  padding: 1em 2em 1em
  font-family: Gilroy, sans-serif
  font-weight: 400
  flex: 1
  width: 100%
  margin-right: 50px
  backface-visibility: hidden
  -webkit-font-smoothing: subpixel-antialiased
  &.playing-keypress-animation
    transform: translateZ(0)
    animation: server-search-bar-animation 100ms ease-in-out
    @keyframes server-search-bar-animation
      from
        transform: scale(.997)
  &::placeholder
    color: $gray
</style>