<template>
  <el-row>
    <el-col :span="8" :offset="8">
      <div class="change-form">
        <div class="text item">
          <p class="change-title">输入修改用户信息</p>
          <el-form :model="change" status-icon ref="change" label-width="80px">
            <el-form-item label="id" prop="id">
              <el-input type="text" v-model="change.id"></el-input>
            </el-form-item>
          </el-form>
          <!-- <el-button type="primary" @click="queryBtn" class="changebtn mb-1" style="font-size: 18px;">
             查询
          </el-button> -->
          <!-- <p class="change-title">输入修改信息</p> -->
          <el-form :model="change" status-icon ref="change" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="change.userName"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="username">
              <el-input type="datetime" v-model="change.createTime"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="text" v-model="change.password" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="积分" prop="jifenb">
              <el-input type="text" v-model="change.jifen"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input type="text" v-model="change.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input type="email" v-model="change.email"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="change.sex" placeholder="请选择">
                <el-option label="男(1)" value="1"></el-option>
                <el-option label="女(0)" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="账号状态" prop="state">
              <el-input type="text" v-model="change.state"></el-input>
            </el-form-item>
          </el-form>
          <el-button :type="btnType" @click="changeBtn" class="changebtn" :disabled="disabled" style="font-size: 18px;">
             确认修改
          </el-button>
        </div>
      </div>
    </el-col>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>信息修改成功。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </el-row>

</template>

<script>
  export default {
    data() {
      return {
        change: {
          id: '',
          createTime: '',
          userName: '',
          password: '',
          email: '',
          phone: '',
          sex: '',
          jifen: '',
          state: '',
        },
        genderRaw: "",
        iconstyle: 'iconfont icon-r-yes',
        disabled: false,
        btnType: 'success',
        isRealchange: false,
        dialogVisible: false,
      }
    },
    components: {},
    methods: {
      mounted() {
        const query = this.$route.query;
        if (query.id) this.change.id = query.id;
        if (query.sex) {
          if(query.sex == '男') this.change.sex = "1";
          else this.change.sex = "0";
        } 
        if (query.email) this.change.email = query.email;
        if (query.phone) this.change.phone = query.phone;
        if (query.userName) this.change.userName = query.userName;
      },
      changeBtn() {
        this.req({
          url: "/updateUser",
          method: "post",
          data: this.change
        }).then(res => {
          console.log(res);
          this.dialogVisible = true;
        });
      },

      // queryBtn() {
      //   this.req({
      //     url: "/getUserById",
      //     method: "post",
      //     params: {
      //       userId: this.change.id
      //     }
      //   }).then(res => {
      //     const userData = res.data;
      //     console.log(userData);
      //     this.change.createTime = userData.createTime;
      //     this.change.userName = userData.userName;
      //     this.change.password = userData.password;
      //     this.change.email = userData.email;
      //     this.change.phone = userData.phone;
      //     this.change.jifen = userData.jifen;
      //     this.change.state = userData.state;
      //     this.change.sex = userData.sex;
      //   });
      // }
    },
    computed: {
      showgender() {
        if (this.genderRaw == 0)
          return "女";
        else
          return "男";
      }
    }
  }
</script>

<style>
  .change-form {
    margin: 2rem;
  }
</style>
