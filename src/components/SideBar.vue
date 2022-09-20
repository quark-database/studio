<template lang="pug">
#sidebar()
  SideBarLogo
  SideBarOption(v-for="option in options", :title="option.title", :icon="option.icon", @sidebar-option-selected="performedSelection")
</template>

<script>
import {playSound} from "@/scripts/web/play-sound"
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
      options: [
        { title: "Servers", icon: "servers.svg" },
        { title: "Table", icon: "table.svg" },
        { title: "Query editor", icon: "console.svg" },
        { title: "AI assistant", icon: "ai.svg" },
        { title: "Settings", icon: "settings.svg" },
        { title: "About Quark", icon: "about-quark.svg" },
      ]
    }
  },

  methods: {
    performedSelection(sidebarOption) {
      this.selectedOptionTitle = sidebarOption.title
      playSound("sidebar-option-selected");
    }
  },
}
</script>

<style lang="sass" scoped>
  #sidebar
    width: 15%
    user-select: none
    height: auto
</style>