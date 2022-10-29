<template lang="pug">
.query-editor-hint-line(v-on:click="onClick")
  span.query-editor-hint-line-type(v-bind:class="type")
  span.query-editor-hint-line-title {{title}}
  span.query-editor-hint-line-description {{description}}
</template>

<script>
export default {
  name: "QueryEditorHintLine",
  props: {
    type: String,
    title: String,
    description: String,
    completion: String
  },

  methods: {
    onClick() {
      this.$emit('query-editor-hint-line-clicked', this)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/colors.sass"

.query-editor-hint-line
  min-height: 1em
  padding: .8em .25em
  display: flex
  align-items: center
  font-family: "JetBrains Mono", monospace
  user-select: none
  cursor: pointer
  &:hover
    background: lighten($editor-popup-background, .3)
  .query-editor-hint-line-type
    &:before
      font-size: 10px
      border-radius: 50rem
      width: 1.2em
      height: 1.2em
      margin-right: 1.5em
      display: inline-block
      text-align: center
      vertical-align: center
      font-weight: 700
    &.constructor:before
      background: #FFAA00
      color: darken(#FFAA00, 25%)
      content: "f"
      font-style: italic
    &.instruction:before
      background: #0075FF
      color: darken(#0075FF, 25%)
      content: "I"
    &.parameter:before
      background: #57D0FF
      color: darken(#57D0FF, 25%)
      content: "P"
  .query-editor-hint-line-title
    color: white
    margin-right: 10em
    opacity: .8
  .query-editor-hint-line-description
    color: white
    opacity: .1
    text-align: right
    margin-left: auto
    font-weight: 300
</style>