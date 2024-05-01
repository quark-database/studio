<template lang="pug">
.plugin-list-item
  img.plugin-list-item-icon(:src="pluginIconPath")
  .plugin-list-item-description-container
    span.plugin-list-item-name {{name}}
    span.plugin-list-item-author {{author}}
</template>

<script>
export default {
  name: "PluginListItem",

  props: {
    name: String,
    author: String,
  },

  data() {
    return {
      pluginIconPath: 'icons/sidebar/plugins.svg'
    }
  }
}
</script>

<style lang="sass" scoped>
@import '@/assets/colors.sass'

.plugin-list-item
  display: flex
  height: 3em
  padding: .5em 1em
  background: white
  border-radius: 5px
  align-items: center
  box-shadow: 3px 3px 25px transparentize($gray, .7)
  .plugin-list-item-icon
    width: 1.5em
    height: auto
    margin-right: 1em
    filter: invert(29%) sepia(97%) saturate(3290%) hue-rotate(204deg) brightness(104%) contrast(107%)
  .plugin-list-item-description-container
    display: flex
    flex-direction: column
    .plugin-list-item-name
      font-weight: 700
    .plugin-list-item-author
      color: $gray

</style>