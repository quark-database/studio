<template lang="pug">
#sidebar
  SideBarLogo
  SideBarOption(v-for="option in options", :title="option.title", :icon="option.icon", :page="option.page", @sidebar-option-selected="performSelection", v-show="connectedToServer || option.page === 'servers'")
  img.sidebar-server-add-image(v-show="!connectedToServer", :src="addServerPath")
  span.sidebar-server-add-title(v-show="!connectedToServer") To connect to a server, click '+' button at the top-right or one of the added servers
</template>

<script>
import SideBarOption from "@/components/SideBarOption";
import SideBarLogo from "@/components/SideBarLogo";

export default {
  name: "SideBar",
  components: {
    SideBarOption,
    SideBarLogo,
  },

  data() {
    return {
      selectedOptionTitle: "Servers",
      connectedToServer: false,
      options: [
        { title: "Servers",        icon: "servers.svg",      page: "servers" },
        { title: "Table viewer",   icon: "table.svg",        page: "table" },
        { title: "Query editor",   icon: "console.svg",      page: "editor" },
        // { title: "AI assistant",   icon: "ai.svg",           page: "ai" },
        { title: "Server plugins", icon: "plugins.svg",      page: "plugins" },
        { title: "Documentation",  icon: "docs.svg",         page: "docs" },
        { title: "About Quark",    icon: "about-quark.svg",  page: "about" },
      ],
      addServerPath: 'images/servers-list-empty.svg'
    }
  },

  methods: {
    performSelection(sidebarOption) {
      if(this.selectedOptionTitle === sidebarOption.title) {
        return
      }

      this.selectedOptionTitle = sidebarOption.title
      this.$parent.sidebarOptionSelected(sidebarOption)
      // playSound("sidebar-option-selected");
    }
  },
}
</script>

<style lang="sass" scoped>
@import '@/assets/colors.sass'

#sidebar
  width: 15%
  user-select: none
  height: auto
  .sidebar-server-add-title
    display: inline-block
    width: 90%
    font-weight: 500
    text-align: center
    color: $gray
  .sidebar-server-add-image
    animation: floating-animation infinite 1s ease-in-out alternate
    @keyframes floating-animation
      from
        transform: translateY(9px)
      from
        transform: translateY(-9px)
</style>