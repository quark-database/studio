<template lang="pug">
#content-panel
  AddServerDialog(ref="addServerDialog", v-on:server-added="updateServerList")
  #servers-content-panel(v-if="page === 'servers'")
    #top-bar
      ServerSearchBar(v-on:key-pressed="onServerSearchBarInput($event)")
      AddServerButton(v-on:click="addServerButtonClicked", v-bind:is-pulsing="!servers.length")
    #server-cards
      ServerCard(v-for="server in servers", v-on:server-card-deleted="updateServerList", v-on:server-card-clicked="connect" :host="server.host", :port="server.port", :token="server.token", :status="server.status", :best-matched="server.bestMatched", :not-matched="server.notMatched")
  .content-panel-container#table-content-panel(v-else-if="page === 'table'")
    template(v-if="this.hasPermissionForTableViewing")
      TableList(ref="tableList", v-on:table-item-selected="tableItemSelected($event)")
      TableEditor(ref="tableEditor")
    template(v-else)
      .banner-container
        img.banner-image(:src="noPermissionBannerPath")
        span.banner-title Wait-wait-wait...
        span.banner-subtitle To open table editor, you must have a permission for data selecting.
  .content-panel-container#editor-content-panel(v-else-if="page === 'editor'")
    QueryEditor
  .content-panel-container#ai-content-panel(v-else-if="page === 'ai'")
    #chat-header
      .chat-avatar
        img.chat-avatar-image(:src="chatAvatarImagePath")
      #chat-title Quarkus
      #chat-label AI
    #chat-body(ref="chatBody")
      #chat-body-scrollable-wrapper
        AIMessageBubble(v-for="message in messages", :text="message.text", :sender-type="message.senderType")
        AIChatLoadingBar(v-if="loaderBarEnabled")
    #chat-input-bar
      input#chat-input(ref="chatInput", v-model="message", @keyup="onChatInput($event)", placeholder="What do you want to do?")
      span#send-button(@click="onSendingMessageToAI", v-bind:class="{ 'active': shouldBeDisabled() }") Send message
  .content-panel-container#plugins-content-panel(v-else-if="page === 'plugins'")
    template(v-if="!plugins.length")
      .banner-container
        img.banner-image(:src="pluginsListEmptyPath")
        span.banner-title No plugins installed on this server!
        span.banner-subtitle You can make your own plugin for Quark Server! Check out <a href="https://github.com/anafro/quark">the official documentation</a> to know how.
    template(v-else)
      h1 Plugins installed
      #plugins-list
        PluginListItem(v-for="plugin of plugins", :name="plugin.name", :author="plugin.author")
  .content-panel-container#docs-content-panel(v-else-if="page === 'docs'")
    h1 Quark QL documentation
    #docs-list
        InstructionDocsItem(v-for="doc of docs", :type="doc.type", :name="doc.title", :permission="doc.permission", :parameters="doc.parameters", :description="doc.description")
  .content-panel-container#settings-content-panel(v-else-if="page === 'settings'")

  .content-panel-container#about-content-panel(v-else-if="page === 'about'")
    #about-logo-container
      img#about-logo(:src="logoPath")
      #about-text-container
        span#about-text-first-line Anafro <b>Quark</b> 1.1
        span#about-text-second-line Made by Anatoly Frolov
    span#about-info Read more about Quark on official <a href="https://github.com/anafro/quark">GitHub page</a>
</template>

<script>
import ServerSearchBar from "@/components/ServerSearchBar";
import AddServerButton from "@/components/AddServerButton";
import ServerCard from "@/components/ServerCard";
import AIMessageBubble from "@/components/AIMessageBubble";
import {sleep} from "@/scripts/web/sleep"
import {playSound} from "@/scripts/web/play-sound";
import {random} from "@/scripts/shared/random-between";
import AIChatLoadingBar from "@/components/AIChatLoadingBar";
import {ipcRenderer} from 'electron'
import AddServerDialog from "@/components/AddServerDialog";
import TableList from "@/components/TableList";
import TableItem from "@/components/TableItem";
import TableEditor from "@/components/TableEditor";
import QueryEditor from "@/components/QueryEditor";
import PluginListItem from "@/components/PluginListItem";
import InstructionDocsItem from "@/components/InstructionDocsItem";

export default {
  name: "ContentPanel",
  components: {
    InstructionDocsItem,
    PluginListItem,
    QueryEditor,
    TableEditor, TableItem, TableList, AddServerDialog, AIChatLoadingBar, AIMessageBubble, ServerCard, AddServerButton, ServerSearchBar},
  data() {
    return {
      servers: [],
      tables: [],
      plugins: [],
      docs: [],
      selectedTable: 'Quark.Scheduled Commands',
      page: 'servers',
      chatAvatarImagePath: "icons/ai-page/quarkus.svg",
      message: '',
      messages: [],
      loaderBarEnabled: false,
      addServerPopupOpened: false,
      logoPath: 'icons/logo.svg',
      pluginsListEmptyPath: 'images/plugins-list-empty.svg',
      noPermissionBannerPath: 'images/security-with-deny-sign.svg',
      hasPermissionForTableViewing: false
    }
  },

  mounted() {
    this.updateServerList()
    this.updatePluginsList()
    this.updateDocsList()
  },

  methods: {
    updatePluginsList() {
      ipcRenderer.invoke('run-query', 'list plugins;').then(result => {
        this.plugins = result.tableView.rows.map(row => ({
          name: row.cells[0],
          author: row.cells[1]
        }))
      })
    },

    updateDocsList() {
      Promise.all([
          ipcRenderer.invoke('run-query', '_describe instructions;'),
          ipcRenderer.invoke('run-query', '_describe constructors;')
      ]).then(results => {
        const instructions = results[0].tableView.rows;
        const constructors = results[1].tableView.rows;

        this.docs = []

        for(const instructionRow of instructions) {
          if(this.docs.every(doc => doc.title !== instructionRow.cells[0])) {
            this.docs.push({
              type: 'instruction',
              title: instructionRow.cells[0],
              description: instructionRow.cells[1],
              permission: instructionRow.cells[2],
              parameters: []
            })
          }

          this.docs.find(doc => doc.title === instructionRow.cells[0]).parameters.push({
            name: instructionRow.cells[3],
            general: instructionRow.cells[4] === 'true',
            required: instructionRow.cells[5] === 'true',
            type: instructionRow.cells[6]
          })
        }

        for(const constructorRow of constructors) {
          if(this.docs.every(doc => doc.title !== constructorRow.cells[0])) {
            this.docs.push({
              type: 'constructor',
              title: constructorRow.cells[0],
              description: constructorRow.cells[1],
              parameters: []
            })
          }

          this.docs.find(doc => doc.title === constructorRow.cells[0]).parameters.push({
            name: constructorRow.cells[2],
            type: constructorRow.cells[3],
            varargs: constructorRow.cells[4] === 'true',
            required: constructorRow.cells[5] === 'true',
            wildcard: constructorRow.cells[6] === 'true',
          })
        }

        console.log(this.docs)
      })
    },

    onServerSearchBarInput(inputContent) {
      if(inputContent === "") {
        for(let server of this.servers) {
          server.bestMatched = false;
          server.notMatched = false;
        }
      } else {
        ipcRenderer.invoke('find-best-string', inputContent, this.servers.map(server => server.host)).then(bestMatch => {
          for(let server of this.servers) {
            server.bestMatched = bestMatch.bestMatch.target === server.host;
            server.notMatched = !server.bestMatched;
          }
        })
      }
    },

    updateServerList() {
      ipcRenderer.invoke('ask-server-list').then(servers => {
        console.log(servers)
        this.servers = servers.map(server => ({...server, status: "waiting", bestMatched: false, notMatched: false}));
      });
    },

    addServerButtonClicked() {
      this.$refs.addServerDialog.show = true;
    },

    switchPanelContent(sidebarOption) {
      this.page = sidebarOption.page;

      switch(this.page) {
        case "servers":
          this.updateServerList()
          break;
        case "docs":
          this.updateDocsList()
          break;
        case "plugins":
          this.updatePluginsList()
          break;
        case "table":
          ipcRenderer.invoke('run-query', 'select from "Quark.Scheduled Commands";').then(result => {
            this.hasPermissionForTableViewing = result.message !== "No Permission"
          })
          break;
      }
    },

    onChatInput(event) {
      if(event.key === 'Enter') {
        this.onSendingMessageToAI()
      } else {
        playSound("typing")
      }
    },

    tableItemSelected(tableName) {
      this.$refs.tableEditor.downloadTablePage(tableName);
      this.$refs.tableList.select(tableName);
    },

    connect(serverCard) {
      ipcRenderer.invoke('set-server', {
        host: serverCard.host,
        port: serverCard.port,
        token: serverCard.token,
      }).then(() => {
        this.$emit('connected')
        this.updateDocsList()
        this.updatePluginsList()
      })
    },

    async onSendingMessageToAI() {
      playSound("ai-message-sent")

      await sleep(300);

      const sendingMessage = this.message

      this.message = ''
      this.$refs.chatInput.disabled = true

      this.messages.push({
        senderType: 'you',
        text: sendingMessage
      });

      this.$refs.chatBody.scrollTop = this.$refs.chatBody.scrollHeight + 50

      await sleep(random(500, 1200))

      this.loaderBarEnabled = true
      this.$refs.chatBody.scrollTop = this.$refs.chatBody.scrollHeight + 50

      await sleep(random(1000, 3500))

      ipcRenderer.invoke('ask-quarkus', sendingMessage).then(value => {
        playSound("ai-message-received")

        this.messages.push({
          senderType: 'ai',
          text: value
        });

        this.$refs.chatBody.scrollTop = this.$refs.chatBody.scrollHeight + 50

        this.$refs.chatInput.disabled = false
        this.loaderBarEnabled = false
      })
    },

    shouldBeDisabled() {
      return this.message.length !== 0 || this.$refs.chatInput?.disabled;
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../assets/colors"

#content-panel
  background: $light
  width: 100%
  max-height: 100%
  border-top-left-radius: 15px
  border-top-right-radius: 15px
  padding: 40px 30px 0
  flex: 1 0

  #docs-content-panel
    display: flex
    flex-direction: column

  #docs-list
    display: flex
    flex-direction: row
    flex-wrap: wrap
    overflow-y: scroll
    .docs-item
      background: white
      padding: 1em 1em
      width: 28%
      border-radius: 15px
      box-shadow: 0 0 15px #00000005


  #plugins-content-panel
    display: flex
    flex-direction: column
    flex-shrink: 0

  #plugins-list
    display: grid
    grid-template-columns: 15em 2.5em

  .banner-container
    display: flex
    flex-direction: column
    margin-bottom: 1em
    align-items: center
    justify-content: center
    width: 100%
    height: 100%
    .banner-image
      width: 30%
      height: auto
    .banner-title
      font-size: 1.75em
      font-weight: 600
      margin-bottom: .25em
    .banner-subtitle
      color: $gray

  .content-panel-container
    display: flex
    flex: 1 0
    height: 100%
    max-width: 100%

  #ai-content-panel
    flex-direction: column

  #top-bar
    display: flex
    align-items: center
    justify-content: center
    justify-items: stretch

  #server-cards
    margin-top: 2em
    display: flex
    flex-wrap: wrap
    justify-content: flex-start
    perspective: 1000px
    perspective-origin: 50% 50%
    gap: 1em
    & > *
      break-after: always

  .chat-avatar
    height: 100%
    width: auto
    background: $light
    border-radius: 50%
    display: flex
    align-items: center
    justify-content: center

  .chat-avatar-image
    width: 80%
    height: auto

  #chat-title
    color: $black
    font-weight: 500
    margin-left: 1em

  #chat-label
    color: white
    font-weight: 800
    background-color: $primary
    display: inline-block
    padding: 2px 6px
    letter-spacing: .07em
    font-size: .8em
    border-radius: 3px
    text-align: center
    margin-left: .5em
    text-shadow: 0 0 5px #FFF5
    box-shadow: 0 0 3px $primary

  #chat-header
    width: calc(100% - 72px)
    background: white
    height: 32px
    border-radius: 10px
    display: flex
    align-items: center
    padding: 12px 36px

  #chat-body
    background-color: white
    flex: 1 0
    border-radius: 10px
    padding: 32px
    margin: 16px 0
    display: flex
    flex-direction: column
    justify-content: flex-start
    overflow-y: auto
    scrollbar-base-color: $gray
    scrollbar-track-color: $primary

  #chat-input-bar
    display: flex
    align-items: center
    justify-content: center
    height: 32px
    width: 100%
    margin-bottom: 16px
    #chat-input
      height: 100%
      flex: 1
      background-color: white
      outline: none
      border-radius: 3px
      border: none
      padding: .5em 3em
      font-family: Gilroy, sans-serif
      font-weight: 500
      &:disabled
        cursor: not-allowed

      &::placeholder
        color: $gray
    #send-button
      cursor: not-allowed
      background: $gray
      padding: .5em 3em
      height: 100%
      margin-left: 2em
      border-radius: 5px
      display: inline-block
      color: white
      font-weight: 500
      line-height: 2
      user-select: none
      &.active
        background: $primary
        cursor: pointer

  #about-content-panel
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    #about-logo-container
      height: 100%
      width: 100%
      display: flex
      align-items: center
      justify-content: center
      animation: about-logo-pulsing 1.1s 200ms ease-in-out alternate-reverse infinite, about-logo-removing 500ms 4s ease-in-out forwards
      @keyframes about-logo-pulsing
        from
          transform: scale(1.02)
        to
          transform: scale(.98)
      @keyframes about-logo-removing
        to
          opacity: 0
          transform: scale(.7)
    #about-logo
      transform-style: preserve-3d
      width: 100px
      height: 100px
      animation-fill-mode: forwards
      animation: about-logo-animation-appear 700ms cubic-bezier(.21, 1.5, .2, .98), about-logo-animation-move 600ms 700ms cubic-bezier(.21, 1.5, .2, .98)
      @keyframes about-logo-animation-appear
        from
          opacity: .3
          transform: translateX(50%) rotateX(45deg) rotateZ(45deg) scale(.2) perspective(1000px)
          filter: blur(15px)
        to
          transform: translateX(50%) rotateX(0) rotateZ(0)
      @keyframes about-logo-animation-move
        from
          transform: translateX(50%)
        to
          transform: translateX(0)
    #about-text-container
      display: flex
      flex-direction: column
      font-size: 26px
      animation: about-text-animation-appear-1 1s 600ms cubic-bezier(.21, 1.5, .2, .98), about-text-animation-appear-2 .5s 600ms cubic-bezier(.21, 1.5, .2, .98)
      opacity: 0
      animation-fill-mode: forwards
      line-height: 1.1
      @keyframes about-text-animation-appear-1
        from
          opacity: 0
          color: $primary
        to
          opacity: 1
          color: $black
      @keyframes about-text-animation-appear-2
        from
          transform: translateX(200%)
      #about-text-second-line
        color: $gray
        font-size: .6em
        align-items: center
  #about-info
    display: inline-block
    text-align: center
    animation: about-info-appear forwards 500ms 4.5s cubic-bezier(.21, 1.5, .2, .98)
    color: gray
    width: 100%
    opacity: 0
    transform: translateY(calc(-50vh - 50%))
    @keyframes about-info-appear
      from
        display: block
        opacity: 0
        transform: scale(.4) translateY(calc(-50vh - 50%))
      to
        opacity: 1
        transform: translateY(calc(-50vh - 50%))
        display: block

#table-content-panel
  display: flex
  flex-direction: row
  width: 100%
</style>