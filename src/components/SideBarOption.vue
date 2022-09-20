<template lang="pug">
.sidebar-option(@click="$emit('sidebar-option-selected', this)", v-bind:class="{'selected': $parent.selectedOptionTitle === this.title}")
  img.icon(:src="iconPath")
  span.title {{title}}
</template>

<script>
export default {
  name: "SideBarOption",
  props: {
    title: String,
    icon: String,
  },

  computed: {
    iconPath: function() {
      return "icons/sidebar/" + this.icon;
    }
  },
}
</script>

<style lang="sass" scoped>
@use '../assets/colors'

.sidebar-option
  transition: .18s
  transition-property: border-left-width, border-left-color
  transition-timing-function: cubic-bezier(.18, 1.66, .66, 1)
  border-left: colors.$gray solid 0px
  padding: .75em 1em .75em
  margin-bottom: 1em
  border-radius: 5px
  display: flex
  align-items: center
  width: calc(100% - 1.5em)
  cursor: pointer
  .title
    font-family: Gilroy, sans-serif
    font-weight: 500
    color: colors.$gray
    transition: .25s
    transition-timing-function: cubic-bezier(.26, 1.9, .52, 1)

  .icon
    width: 1em
    height: auto
    margin-right: .8em
    filter: invert(86%) sepia(32%) saturate(0%) hue-rotate(177deg) brightness(89%) contrast(94%)

  &.selected
    border-left: colors.$primary solid 5px
    background: colors.$light
    cursor: not-allowed
    .title
      color: colors.$primary
      margin-left: .6em
      font-weight: 700
    .icon
      filter: invert(29%) sepia(97%) saturate(3290%) hue-rotate(204deg) brightness(104%) contrast(107%)
</style>