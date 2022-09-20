<template lang="pug">
#content-panel
  #top-bar
    ServerSearchBar
    AddServerButton
  #server-cards
    ServerCard(host="localhost", port="10000", token="root", status="waiting")
    ServerCard(host="autosl.com", port="10000", token="root", status="bad-token")
    ServerCard(host="galoga.com", port="10000", token="root", status="online")
    ServerCard(host="219.40.0.4", port="10000", token="root", status="offline")
    ServerCard(host="autosl.com", port="10000", token="root", status="bad-token")
</template>

<script>
import ServerSearchBar from "@/components/ServerSearchBar";
import AddServerButton from "@/components/AddServerButton";
import ServerCard from "@/components/ServerCard";
export default {
  name: "ContentPanel",
  components: {ServerCard, AddServerButton, ServerSearchBar}
}
</script>

<style lang="sass" scoped>
@import "../assets/colors"

#content-panel
  background: $light
  width: 100%
  border-top-left-radius: 15px
  border-top-right-radius: 15px
  padding: 40px 30px 0

  #top-bar
    display: flex
    align-items: center
    justify-content: center
    justify-items: stretch

  #server-cards
    margin-top: 2em
    display: flex
    justify-content: space-between

</style>