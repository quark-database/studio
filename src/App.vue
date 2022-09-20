<template lang="pug">
ToolBar
#bottom-components-container
  SideBar
  ContentPanel
</template>

<script>
import ToolBar from "@/components/ToolBar";
import SideBar from "@/components/SideBar";
import ContentPanel from "@/components/ContentPanel";

export default {
  name: 'App',
  components: {
    ToolBar,
    SideBar,
    ContentPanel
  }
}
</script>

<style lang="sass">
html, body
  height: 100%
  width: 100%
  margin: 0
  padding: 0
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

#app
  font-family: Gilroy, "Helvetica Neue", Helvetica, Arial, sans-serif
  padding: 0 20px 0
  width: calc(100% - 40px)
  display: flex
  flex-flow: column
  height: 100%
  #bottom-components-container
    display: flex
    align-items: stretch
    height: calc(100% - 20px)
</style>
