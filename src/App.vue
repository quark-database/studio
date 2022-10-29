<template lang="pug">
ToolBar
#bottom-components-container
  SideBar(ref="sideBar", v-on:sidebar-option-selected="sidebarOptionSelected($event)")
  ContentPanel(ref="contentPanel", v-on:connected="onConnection")
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
  },

  data() {
    return {
      currentServer: {
        host: "localhost",
        port: 10000,
        token: "root"
      }
    }
  },

  methods: {
    sidebarOptionSelected(sidebarOption) {
      this.$refs.contentPanel.switchPanelContent(sidebarOption)
    },

    onConnection() {
      this.$refs.sideBar.connectedToServer = true
    }
  }
}
</script>

<style lang="sass">
@import "assets/colors"

h1, h2, h3, h4, h5, h6
  display: block
html, body
  height: 100%
  width: 100%
  margin: 0
  padding: 0
  overflow: hidden
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  *::selection
    background: $primary
    color: white

a
  color: $primary
  text-decoration: none

#app
  font-family: Gilroy, "Helvetica Neue", Helvetica, Arial, sans-serif
  padding: 0 20px 0
  width: calc(100% - 40px)
  display: flex
  flex-flow: column
  height: 100%
  overflow: hidden
  #bottom-components-container
    display: flex
    align-items: stretch
    min-height: calc(100% - 20px)
    max-height: calc(100% - 20px)

</style>
