<template lang="pug">
#table-list
  span#table-list-title Tables on this server
  TableItem(ref="tableItems", v-for="table in tables", :table-name="table", v-bind="$attrs")
</template>

<script>
import {ipcRenderer} from "electron";
import TableItem from "@/components/TableItem";

export default {
  inheritAttrs: false,
  name: "TableList",
  components: {TableItem},
  data() {
    return {
      tables: []
    }
  },

  mounted() {
    ipcRenderer.invoke('ask-table-list').then(tables => {
      this.tables = tables;
    })
  },

  methods: {
    select(tableName) {
      this.$refs.tableItems.forEach(tableItem => {
        tableItem.setSelected(tableItem.tableName === tableName);
      })
    }
  }
}
</script>

<style lang="sass" scoped>
#table-list
  width: 20%
  user-select: none
  #table-list-title
    font-weight: 700
    margin-bottom: 1em
    display: inline-block
</style>