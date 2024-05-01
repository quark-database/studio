<template lang="pug">
#table-editor
  #table-editor-title-container
    img#table-editor-title-icon(:src="tableHeaderSrc")
    span#table-editor-title {{tableName}}
    #table-editor-page-switch-container
      span.table-editor-page-switch-button#table-editor-page-switch-next-button(v-bind:class="{ disabled: this.page === 0 }", v-on:click="setPage(page - 1)") &lt;
      span#table-editor-page-switch-title(ref="pageSwitchTitle") Page \#{{this.page + 1}} of {{this.maxPage}}
      span.table-editor-page-switch-button#table-editor-page-switch-previous-button(v-bind:class="{ disabled: this.page + 1 === this.maxPage }", v-on:click="setPage(page + 1)") &gt;
  table#table-editor-view
    tr#table-editor-view-header
      th(v-for="tableViewHeaderCell in tableViewHeader") {{tableViewHeaderCell}}
    tr.table-editor-view-row(v-for="tableViewRow in tableViewRows")
      td.table-editor-view-cell(v-for="tableViewCell in tableViewRow")
        input.table-editor-view-cell-input(v-bind:value="tableViewCell")
    //tr#table-editor-view-add-button
    //  span#table-editor-view-add-button-title + Add a new row
</template>

<script>

import {ipcRenderer} from "electron";

export default {
  name: "TableEditor",
  data() {
    return {
      tableName: '',
      tableHeaderSrc: "../icons/sidebar/table.svg",
      page: 0,
      maxPage: 0,
      rowsAtPage: 15,

      tableViewHeader: [],
      tableViewRows: []
    }
  },

  mounted() {
    this.downloadTablePage("Quark.Tokens")
  },

  watch: {
    tableName: function(newTableName) {
      if(newTableName === '') {
        return;
      }

      this.downloadTablePage(newTableName)
    }
  },

  methods: {
    downloadTablePage(tableName) {
      this.tableName = tableName;

      ipcRenderer.invoke('run-query', `select from "${tableName}";`).then(result => {
        console.log(result)

        this.maxPage = Math.ceil(result.tableView.rows.length / this.rowsAtPage);
      });

      ipcRenderer.invoke('run-query', `select from "${tableName}": skip = ${this.page * this.rowsAtPage}, limit = ${this.rowsAtPage};`).then(result => {
        console.log(result)

        this.tableViewHeader = result.tableView.header.columnNames.flat();
        this.tableViewRows = result.tableView.rows.map(row => row.cells);
      });
    },

    setPage(page) {
      if(page >= 0 && page < this.maxPage) {
        this.page = page;
        this.downloadTablePage(this.tableName)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../assets/colors'

#table-editor
  width: 80%
  padding: 0 1em
  & *
    box-sizing: border-box
  #table-editor-view
    width: 100%
    background: white
    border-radius: 5px
    border: 1px transparentize($gray, .7) solid
    th, #table-editor-view-add-button
      text-align: left
      padding: .5em 1em
    .table-editor-view-cell-input
      outline: none
      font-family: Gilroy, sans-serif
      width: 100%
      height: 100%
      font-size: 1em
      border-radius: 3px
      transition: 100ms cubic-bezier(.26, 1.9, .52, 1)
      padding: .5em 1em
      border: 2px solid transparent
      &:focus
        border: 2px solid $primary
        background: transparentize($primary, .97)
        box-shadow: inset 0 0 7px transparentize($primary, .7)
        color: $primary
    #table-editor-view-add-button
      display: inline-block
      width: 100%
      color: $primary
      user-select: none
      cursor: pointer
  #table-editor-title-container
    display: flex
    align-items: center
    margin-bottom: 1em
    #table-editor-title
      font-weight: 600
      margin-left: .5em
    #table-editor-title-icon
      width: 0.8em
      height: auto
      filter: invert(29%) sepia(97%) saturate(3290%) hue-rotate(204deg) brightness(104%) contrast(107%)
    #table-editor-page-switch-container
      margin-left: 2em
      .table-editor-page-switch-button
        color: $primary
        font-weight: 1000
        cursor: pointer
        user-select: none
        &.disabled
          color: $gray
          cursor: not-allowed
      #table-editor-page-switch-title
        margin: 0 2em
        color: $primary
        font-weight: 500
        user-select: none
</style>