<template lang="pug">
.docs-item.instructions-docs-item
  .instructions-docs-header
    span.instructions-docs-icon(v-bind:class="type") {{type === 'instruction' ? 'I' : '@'}}
    span.instructions-docs-name {{name}}
    span.instructions-docs-permission {{permission}}
  span.instructions-docs-description {{description}}
  span.instructions-docs-title Parameters:
  .instructions-docs-parameter(v-for="parameter of parameters")
    span.instructions-docs-parameter-type(v-bind:class="type") {{parameter.type}}
    span.instructions-docs-parameter-name {{parameter.name}}
</template>

<script>
export default {
  name: "InstructionDocsItem",

  props: {
    type: String,
    name: String,
    permission: String,
    description: String,
    parameters: Array
  },

  data() {
    return {

    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/colors.sass"

.docs-item.instructions-docs-item
  font-family: "JetBrains Mono", monospace
  display: flex
  flex-direction: column
  margin: 25px 15px
  .instructions-docs-header
    display: flex
    flex-direction: row
    align-items: center
    .instructions-docs-icon
      display: inline-block
      color: white
      min-width: 1.3em
      min-height: 1.3em
      border-radius: 50rem
      margin-right: 1em
      text-align: center
      line-height: 1.4em
      font-size: 12px
      &.instruction
        background: $primary
      &.constructor
        background: #fd971f
    .instructions-docs-name
      font-weight: 700
    span.instructions-docs-permission
      font-weight: 300
      align-self: flex-end
      margin-left: auto
      color: $gray
  .instructions-docs-title
    margin-top: 1.5em
    font-weight: 400
    font-style: italic
  .instructions-docs-parameter
    width: 100%
    display: flex
  .instructions-docs-parameter-type
    &.instruction
      color: $primary
    &.constructor
      color: #fd971f
  .instructions-docs-parameter-name
    margin-left: auto
    align-self: flex-end
</style>