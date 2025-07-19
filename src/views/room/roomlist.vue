<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      fit
      highlight-current-row
      style="width: 75%; margin: 0 auto;"
    >
      <el-table-column prop="id" label="ID" align="center" width="80"></el-table-column>
      <el-table-column prop="number" label="房间号" align="center" width="120"></el-table-column>
      <el-table-column prop="type" label="房间类型" align="center" width="150"></el-table-column>
      
      <el-table-column prop="introduce" label="介绍" min-width="300" header-align="center"></el-table-column>

      </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  methods: {
    // listRooms() {
    //   this.loading = true;
    //   this.req({
    //     url: "/rooms",
    //     method: "get",
    //   }).then((res) => {
    //       this.tableData = res.data;
    //       for (var i = 0; i < this.tableData.length; ++i) {
    //         switch (this.tableData[i].type.id) {
    //           case 1:
    //             this.tableData[i].type.typeName = "单人房";
    //             break;
    //           case 2:
    //             this.tableData[i].type.typeName = "双人房";
    //             break;
    //           case 3:
    //             this.tableData[i].type.typeName = "三人房";
    //             break;
    //           case 4:
    //             this.tableData[i].type.typeName = "大床房";
    //             break;
    //           case 5:
    //             this.tableData[i].type.typeName = "豪华套房";
    //             break;
    //         }
    //         this.tableData[i].type = this.tableData[i].type.typeName;
    //       }
    //       this.loading = false;
    //   }).catch(err => {
    //       console.error("获取房间列表失败:", err);
    //       this.loading = false;
    //   });
    // },
      listRooms() {
          this.loading = true; // 开始加载

          // 1. 将上面提供的 JSON 数组粘贴到这里
          const staticData = [
              { "id": 101, "number": "101", "type": { "id": 4, "typeName": "大床房", "price": 350.00 }, "state": 0, "maxPeople": 2, "introduce": "视野开阔，配备舒适的1.8米宽大床，适合商旅人士。房间安静舒适，提供免费高速无线网络和24小时热水。" },
              { "id": 205, "number": "205", "type": { "id": 2, "typeName": "双人房", "price": 420.00 }, "state": 1, "maxPeople": 2, "introduce": "房间内有两张独立的1.2米单人床，适合朋友或同事结伴出游。窗外是城市景观。" },
              { "id": 601, "number": "601", "type": { "id": 5, "typeName": "豪华套房", "price": 880.00 }, "state": 0, "maxPeople": 4, "introduce": "超过80平方米的宽敞空间，包含独立的客厅、卧室和工作区。提供全套高端洗浴用品和管家服务，是家庭出游或高端商务的理想选择。" },
              { "id": 310, "number": "310", "type": { "id": 1, "typeName": "单人房", "price": 280.00 }, "state": 0, "maxPeople": 1, "introduce": "经济实惠的紧凑型单人房，设施齐全，安静舒适，性价比极高。" }
          ];

          // 2. 使用 setTimeout 模拟网络延迟
          setTimeout(() => {
              // 3. 直接将静态数据赋值，并保留你原有的数据处理逻辑
              this.tableData = staticData;
              for (var i = 0; i < this.tableData.length; ++i) {
                  // 你的 state 转换逻辑（虽然不显示，但保留逻辑无妨）
                  if (this.tableData[i].state == 0) {
                      this.tableData[i].state = "空闲";
                  } else if (this.tableData[i].state == 1) {
                      this.tableData[i].state = "已入住";
                  }
                  // 你的 type 转换逻辑
                  switch (this.tableData[i].type.id) {
                      case 1: this.tableData[i].type.typeName = "单人房"; break;
                      case 2: this.tableData[i].type.typeName = "双人房"; break;
                      case 3: this.tableData[i].type.typeName = "三人房"; break;
                      case 4: this.tableData[i].type.typeName = "大床房"; break;
                      case 5: this.tableData[i].type.typeName = "豪华套房"; break;
                  }
                  this.tableData[i].type = this.tableData[i].type.typeName;
              }
              this.loading = false; // 加载完成
          }, 500); // 模拟500毫秒延迟
      },
  },
  created() {
    this.listRooms();
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>