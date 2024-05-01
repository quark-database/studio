<template lang="pug">
.table-item(v-bind:class="{selected: selected}", v-on:click="onClick")
  img.table-item-icon(:src="tableItemIconSrc")
  span.table-item-title {{tableName}}
</template>

<script>
export default {
  name: "TableItem",

  props: {
    tableName: String,
  },

  data() {
    return {
      tableItemIconSrc: "../icons/sidebar/table.svg",
      selected: false,
    }
  },

  methods: {
    onClick() {
      this.$emit('table-item-selected', this.tableName)
    },

    setSelected(selected) {
      this.selected = selected;
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../assets/colors"

.table-item
  display: flex
  align-items: center
  margin-bottom: .4em
  cursor: pointer
  transition: transform cubic-bezier(.26, 1.9, .52, 1) 300ms
  .table-item-title
    color: #333
  &:not(.selected):hover
    transform: translateX(8px) translateZ(0) scale(1.03)
  .table-item-icon
    width: .8em
    filter: invert(29%) sepia(97%) saturate(3290%) hue-rotate(204deg) brightness(104%) contrast(107%)
    margin-right: 1em
    transition: margin-right 250ms cubic-bezier(.26, 1.9, .52, 1)
  &.selected
    cursor: not-allowed
    .table-item-icon
      margin-right: 1.5em
    .table-item-title
      color: $primary
      font-weight: 500

</style>