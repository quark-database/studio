<template lang="pug">
#query-editor
  #query-editor-toolbar
    #query-editor-run-button.run(ref="runButton", v-on:click="runQuery")
      img#query-editor-run-button-icon(:src="runButtonSrc")
      span#query-editor-run-button-title Run instruction
  #query-editor-container
    pre#query-editor-line-numbers(ref="lineNumbers") 1
    #query-editor-workspace
      textarea#query-editor-area(ref="editorArea", v-model="query", v-on:input="highlight", v-on:keydown.tab="insertTab", v-on:keydown.down="downPressed", v-on:keydown.up="upPressed", v-on:keydown.enter="enterPressed")
      pre#query-editor-highlight.language-quark(ref="highlight", v-html="highlightedCode")
      QueryEditorHint(ref="hint", v-bind:is-visible="isHintVisible", v-on:hint-line-clicked="hintLineClicked")
  #query-editor-output
    #query-editor-output-lines
      span#query-editor-output-title --- Execution result ---
      .query-editor-output-line
        span.query-editor-output-line-title Message:
        span.query-editor-output-line-message {{message}}
      .query-editor-output-line
        span.query-editor-output-line-title Status:
        span.query-editor-output-line-message {{status}}
      .query-editor-output-line
        span.query-editor-output-line-title Time spent:
        span.query-editor-output-line-message {{time}}
      .query-editor-output-line
        span.query-editor-output-line-title Exception message:
        span.query-editor-output-line-message {{exception}}
    #query-editor-output-table-container
      table#query-editor-output-table
        tr
          th(v-for="columnName in header") {{columnName}}
        tr(v-for="row in rows")
          td(v-for="cell in row.cells") {{cell}}
</template>

<script>
import * as Prism from 'prismjs';
import QueryEditorHint from "@/components/QueryEditorHint";
import * as getCaretCoordinates from 'textarea-caret';
import {ipcRenderer} from "electron";

Prism.languages.quark = {
  'keyword': /\badd\s+column|count\+sin|create\s+table|change\s+in|change\s+port\s+to|clear\s+database|clear\s+table|clone\s+database\s+scheme|clone\s+database|clone\s+table\s+scheme|clone\s+table|create\s+database|create\s+token|_debug|delete\s+column|delete\s+database|delete\s+from|delete\s+table|eval|factory\s+reset|grant\s+token|insert\s+into|list\s+columns\s+in|list\s+databases|list\s+tables\s+in|redefine\s+column\s+in|redefine\s+permissions\s+for\s+token|rename\s+column\s+in|rename\s+database|rename\s+server\s+to|rename\s+table|reorder\s+columns\s+in|run\s+command|schedule\s+command|schedule\s+query|select\s+from|stop\s+server|swap\s+columns\s+in|remove\s+permission\s+from\s+token|list\s+plugins|secret|add\s+modifier\s+to|find in|_describe\s+modifiers\b/i,
  'string': {
    pattern: /(^|[^@\\])(")(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
    greedy: true,
    lookbehind: true
  },
  'operator': /\b:|;|\(|\)|=|,\b/,
  'function': /@[a-zA-Z ]+/,
  'number': /\b\d+L?.?[0-9]*\b/,
  'parameter': /\btable|generator|selector|changer|destination|columns|modifiers|records|permissions|table|skip|limit|permission|record|definition|old|new|order|period|first|second|finder\b/
}

export default {
  name: "QueryEditor",
  components: {QueryEditorHint},
  data() {
    return {
      query: '',
      highlightedCode: '',
      runButtonSrc: 'icons/run.svg',
      message: '',
      status: '',
      time: '',
      exception: '',
      header: [],
      rows: []
    }
  },

  methods: {
    downPressed() {
      this.$refs.hint.moveDown()
    },

    upPressed() {
      this.$refs.hint.moveUp()

    },

    enterPressed() {

    },

    async runQuery() {
      let runButton = this.$refs.runButton;

      if (!runButton.classList.contains('run')) {
        runButton.classList.add('run');

        ipcRenderer.invoke('run-query', this.query).then(result => {
          this.message = result.message;
          this.status = result.executionStatus;
          this.time = result.time + " millisecond" + (result.time === 1 ? "" : "s");
          this.exception = result.exception;
          this.header = result.tableView.header.columnNames.flat();
          this.rows = result.tableView.rows;
        })

        runButton.classList.remove('run');
      }
    },

    highlight(event) {
      let runButton = this.$refs.runButton;

      if(this.query.trim().length === 0) {
        runButton.classList.add('run');
      } else {
        runButton.classList.remove('run');
      }

      if(event !== undefined) {
        const coordinates = getCaretCoordinates(event.target, event.target.selectionEnd);
        this.$refs.hint.update(this.query, event.target.selectionEnd, coordinates.left, coordinates.top + 24)
      }

      this.highlightedCode = Prism.highlight(this.query, Prism.languages.quark, 'quark')

      this.$refs.lineNumbers.innerHTML = ""

      for(let i = 0; i <= this.query.split("\n").length - 1; i++) {
        this.$refs.lineNumbers.innerHTML += (i + 1) + '\n'
      }
    },

    insertTab(event) {
      event.preventDefault();
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;

      this.query = this.query.substring(0, start) + "\t" + this.query.substring(end);

      event.target.selectionStart = event.target.selectionEnd = start + 1;

      this.highlight(event)
    },

    hintLineClicked(hintLine) {
      const start = this.$refs.editorArea.selectionStart;
      const end = this.$refs.editorArea.selectionEnd;

      this.query = this.query.substring(0, start) + hintLine.completion + this.query.substring(end);

      this.$refs.editorArea.selectionStart = this.$refs.editorArea.selectionEnd = start + 1;
      this.$refs.editorArea.focus();

      this.highlight()
      this.$refs.hint.hintLines = []
    }
  },
}
</script>

<style lang="sass">
@import "@/assets/colors.sass"
#query-editor
  width: 100%
  display: flex
  flex-direction: column
  justify-content: stretch
#query-editor-output
  height: 20em
  width: calc(100% - 26px)
  padding: 1em
  z-index: 10
  background: $editor-popup-background
  font-family: "JetBrains Mono", monospace
  font-size: 13px
  color: white
  display: flex
  flex-direction: column
  gap: 1em
  #query-editor-output-lines
    display: flex
    flex-direction: column
    height: 50%
    #query-editor-output-title
      margin-bottom: 1.25em
      display: inline-block
    .query-editor-output-line
      display: flex
      .query-editor-output-line-title
        font-weight: 500
      .query-editor-output-line-message
        opacity: 0.5
        font-weight: 400
        text-align: right
        margin-left: auto
  #query-editor-output-table-container
    height: 50%
    overflow-y: scroll
    &::-webkit-scrollbar
      width: 5px
    &::-webkit-scrollbar-track
      background: $editor-background
    &::-webkit-scrollbar-thumb
      background: $primary
    #query-editor-output-table
      border-collapse: collapse
      table-layout: fixed
      width: 100%
      overflow-x: hidden
      overflow-y: scroll
      tr
        border-bottom: #fff2 1px solid
      th, td
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
      th
        font-weight: 700
      td
        font-weight: 400
        opacity: .7
#query-editor-toolbar
  width: 100%
  background: $editor-background
  height: 1em
  padding-top: 1em
  border-top-left-radius: 5px
  border-top-right-radius: 5px
  #query-editor-run-button
    cursor: pointer
    font-size: 13px
    user-select: none
    &.run
      opacity: .3
      cursor: not-allowed
    #query-editor-run-button-icon
      width: .8em
      height: auto
      margin-left: 5.5em
      margin-right: 1em
    #query-editor-run-button-title
      color: white
      font-weight: 400
#query-editor-container
  display: flex
  align-items: stretch
  width: calc(100% - 40px)
  height: 100%
  #query-editor-line-numbers
    background: $editor-background
    color: #fff5
    padding: 20px 15px 20px 30px
    height: calc(100% - 2em)
    margin: 0
    font-family: "JetBrains Mono", monospace
    font-size: 13px
    line-height: 1.8em
#query-editor-workspace
  width: 100%
  height: 100%
  position: relative
  word-wrap: break-word
  display: inline-block

#query-editor-area, #query-editor-highlight
  width: 100%
  height: calc(100% - 2em)
  font-family: "JetBrains Mono", monospace
  font-size: 13px
  padding: 20px
  margin: 0
  resize: none
  overflow: hidden
  position: absolute
  color: transparent
  caret-color: white
  background: transparent
  outline: none
  border: none
  top: 0
  left: 0
  word-wrap: break-word
  tab-size: 2em
  line-height: 1.8em
  border-radius: 0 0 5px 5px
#query-editor-area
  z-index: 1
#query-editor-highlight
  user-select: none
  background: #001C38
  color: white
  .token
    display: inline-block
</style>