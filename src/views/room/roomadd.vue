<template>
  <div class="app-container">
    <el-row>
      <el-col :span="16" :offset="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>输入新房间信息</span>
          </div>
          
          <el-form
            :model="addForm"
            :rules="rules"
            ref="addFormRef"
            label-width="120px"
            class="add-form"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="房间号" prop="number">
                  <el-input v-model.number="addForm.number" placeholder="例如：301"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最大容纳人数" prop="maxPeople">
                  <el-input-number v-model="addForm.maxPeople" :min="1" style="width: 100%;"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="房间类型" prop="type">
                  <el-select v-model="addForm.type" placeholder="请选择房间类型" style="width: 100%;">
                    <el-option label="单人房" :value="1"></el-option>
                    <el-option label="双人房" :value="2"></el-option>
                    <el-option label="三人房" :value="3"></el-option>
                    <el-option label="大床房" :value="4"></el-option>
                    <el-option label="豪华套房" :value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="房间状态" prop="state">
                  <el-select v-model="addForm.state" placeholder="请选择房间状态" style="width: 100%;">
                    <el-option label="空闲" :value="0"></el-option>
                    <el-option label="已入住" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="房间介绍" prop="introduce">
              <el-input 
                type="textarea" 
                v-model="addForm.introduce"
                placeholder="请输入房间的简单介绍（可选）"
              ></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="submitForm" :loading="loading">确认添加</el-button>
              <el-button @click="resetForm">重置表单</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" center>
      <span>新房间信息添加成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const initialForm = {
      number: '',
      type: null,
      state: 0,
      maxPeople: 1,
      introduce: "",
    };
    return {
      addForm: { ...initialForm },
      initialForm: initialForm,
      loading: false,
      dialogVisible: false,
      rules: {
        number: [
          { required: true, message: '请提供房间号', trigger: 'blur' },
          { type: 'number', message: '房间号必须为数字值'}
        ],
        type: [{ required: true, message: '请选择房间类型', trigger: 'change' }],
        maxPeople: [{ required: true, message: '请填写最大容纳人数', trigger: 'blur' }],
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          const payload = {
            number: this.addForm.number,
            typeId: this.addForm.type,
            state: this.addForm.state,
            max_people: this.addForm.maxPeople,
            introduce: this.addForm.introduce
          };
          
          this.req({
            url: "/rooms",
            method: "post",
            data: payload
          }).then((res) => {
            this.loading = false;
            this.dialogVisible = true;
            this.resetForm();
          }).catch(err => {
            this.loading = false;
            console.log("请求失败了: ", err);
          });
        } else {
          this.$message.error('请检查表单必填项！');
          return false;
        }
      });
    },
    // 重置表单的方法
    resetForm() {
      this.$refs.addFormRef.resetFields();
      this.addForm = { ...this.initialForm };
    }
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.box-card {
  width: 100%;
}
.add-form {
  margin-top: 20px;
}
</style>