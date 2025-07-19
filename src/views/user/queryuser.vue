<template>
    <div class="user-table">
          <div style="margin-bottom: 20px;">
            <el-input v-model="queryName" placeholder="用户名" style="width: 180px; margin-right: 10px;" clearable />
            <el-input v-model="querySex" placeholder="性别(0女/1男)" style="width: 200px; margin-right: 10px;" clearable />
            <el-input v-model="queryEmail" placeholder="邮箱" style="width: 180px; margin-right: 10px;" clearable />
            <el-input v-model="queryPhone" placeholder="手机号" style="width: 180px; margin-right: 10px;" clearable />
            <el-button type="primary" @click="listUser">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="id" class="text-center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column prop="email" label="邮箱"> </el-table-column>
            <el-table-column prop="userName" label="用户名"> </el-table-column>
            <el-table-column prop="sex" label="性别"> </el-table-column>
            <el-table-column prop="phone" label="手机号码"> </el-table-column>
            <el-table-column prop="state" label="状态"> </el-table-column>
            <el-table-column label="操作" width="140" fixed="right">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        @click="$router.push({
                            path: '/user/change-user', query: {
                                id: scope.row.id, 
                                sex: scope.row.sex,
                                phone: scope.row.phone,
                                email: scope.row.email,
                                userName: scope.row.userName,
                            }
                        })"
                        style="font-size: 18px;"
                        >
                         编辑</el-button>
                    <el-button
                        type="danger"
                        @click="deleteUser(scope.row.id)"
                        style="font-size: 18px;"
                        >
                         删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
         <div class="block" style="margin-top:15px;">
            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-sizes="[1,5,10,20]" 
                :page-size="pageSize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="tableData.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            queryName:"",
            querySex: "",
            queryEmail: "",
            queryPhone: "",
            currentPage: 1,
            pageSize: 10
        };
    },
    methods: {
        deleteUser(id) {
            this.$confirm("确定删除该用户？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.req({
                        url: "/users",
                        method: "delete",
                        params: {
                            userId: id,
                        },
                    }).then((res) => {
                        if (res.code == 1) {
                            this.$message({
                            type: "success",
                            message: "删除成功",
                            });
                        }else {
                            this.$message({
                                type: "error",
                                message: "删除失败",
                            });
                        }
                        this.listUser();
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        listUser() {
            const params = {
                page: this.currentPage,
                pageSize: this.pageSize
            };
            if (this.queryName) params.name = this.queryName;
            if (this.querySex) params.sex = this.querySex;
            if (this.queryEmail) params.email = this.queryEmail;
            if (this.queryPhone) params.end = this.queryPhone;
            this.req({
                url: "/users",
                method: "get",
            }).then((res) => {
                this.tableData = res.data;
                for (var i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].sex == 0) {
                        this.tableData[i].sex = "女";
                    } else if (this.tableData[i].sex == 1) {
                        this.tableData[i].sex = "男";
                    }

                    if (this.tableData[i].state == 0) {
                        this.tableData[i].state = "游客";
                    } else if (this.tableData[i].state == 1) {
                        this.tableData[i].state = "会员";
                    }
                }
            })
                .catch((res) => {
                    console.log("err:" + res);
                });
        },
    },
    mounted() {
        this.listUser();
    },
    handleSizeChange(val) {
         console.log(`每页 ${val} 条`);
         this.currentPage = 1;
         this.pageSize = val;
    },
     //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
         console.log(`当前页: ${val}`);
         this.currentPage = val;
    },
    resetQuery() {
        this.queryName = "";
        this.querySex = "";
        this.queryEmail = "";
        this.queryPhone = "";
        this.listUser();
    },
};
</script>

<style>
.user-table {
    margin: 2rem;
}
</style>
