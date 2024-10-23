<template>
  <div class="card_list">
    <div
      class="item"
      v-for="(item,index) in cardList"
      :key="index"
      @click="gotoDetail"
    >
      <div class="item_name">{{item.name}}</div>
      <div class="item_phone">{{item.phone}}</div>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  height: 100%;
}
html,
body {
  height: 100%;
}
.card_list {
  width: 100%;
  min-height: 100%;
  background-color: #eee;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  .item {
    width: 150px;
    padding: 10px;
    border: 1px solid #aaa;
    border-radius: 4px;
    display: flex;
    justify-items: center;
    align-items: center;
    flex-direction: column;
    background-color: #ddd;
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    .item_name {
      text-align: center;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 28px;
      color: #333;
    }
    .item_phone {
      font-size: 16px;
      color: #666;
    }
  }
}
</style>
<script>
export default {
  data() {
    return {
      cardList: [
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        },
        {
          name: '余先生',
          phone: 13223344567
        }
      ]
    }
  },
  methods: {
    gotoDetail() {
      this.$router.push({
        path: `/todo`
      })
    }
  }
}
</script>