<template lang="pug">
#query-editor-hint(ref="hint" v-show="hintLines.length")
  QueryEditorHintLine(v-on:query-editor-hint-line-clicked="hintLineClicked", v-for="hintLine of hintLines", :type="hintLine.type", :title="hintLine.title", :description="hintLine.description", :completion="hintLine.completion")
</template>

<script>
import QueryEditorHintLine from "@/components/QueryEditorHintLine";
import {ipcRenderer} from "electron";
export default {
  name: "QueryEditorHint",
  components: {QueryEditorHintLine},
  data() {
    return {
      hintLines: [],
      selectedOption: 0
    }
  },

  methods: {
    update(query, caretPosition, x, y) {
      this.selectedOption = 0

      ipcRenderer.invoke('run-query', `_hint next elements: query = "${query.replace(/[\\"]/g, '\\$&')}", caret position = ${caretPosition};`).then(result => {
        this.hintLines = result.tableView.rows.map(row => ({
          type: row.cells[0],
          title: row.cells[1],
          description: row.cells[2],
          completion: row.cells[3],
        }))
      })

      this.$refs.hint.style.left = x + "px"
      this.$refs.hint.style.top = y + "px"
    },

    hintLineClicked(hintLine) {
      this.$emit('hint-line-clicked', hintLine)
    },

    moveUp() {
      this.select(this.selectedOption - 1)
    },

    moveDown() {
      this.select(this.selectedOption + 1)
    },

    select(optionIndex) {
      this.selectedOption = optionIndex % this.hintLines.length
    },
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/colors.sass"

#query-editor-hint
  position: absolute
  border-radius: 5px
  background: #002A4C
  box-shadow: 3px -3px 7px transparentize(black, .75)
  display: flex
  flex-direction: column
  padding: .5em 1em
  font-size: 13px
  transition: 300ms cubic-bezier(0, 1.51, .93, 1)
  animation: query-editor-hint-animation cubic-bezier(.18, 1.66, .66, 1) 300ms
  max-height: 15em
  overflow-y: scroll
  z-index: 999
  &::-webkit-scrollbar
    width: 5px
  &::-webkit-scrollbar-track
    background: $editor-background
  &::-webkit-scrollbar-thumb
    background: $primary
    //border-radius: 50rem
  @keyframes query-editor-hint-animation
    from
      transform: translateX(-15px)
      opacity: 0
    to
      transform: translateX(0)
      opacity: 1
</style>