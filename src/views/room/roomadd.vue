<template>
  <div class="app-container">
    <el-row>
      <el-col :span="16" :offset="4">
        <div class="content-card">
          <div class="card-header">
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
                  <el-input v-model="addForm.number" placeholder="例如：301"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最大容纳人数" prop="max_people">
                  <el-input-number v-model="addForm.max_people" :min="1" style="width: 100%;"></el-input-number>
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
                :rows="3"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm" :loading="loading">确认添加</el-button>
              <el-button @click="resetForm">重置表单</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="操作成功" :visible.sync="dialogVisible" width="30%" center>
      <span>新房间信息添加成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RoomAdd',
  data() {
    const initialForm = {
      number: '',
      type: null,
      state: 0,
      max_people: 1,
      introduce: "",
    };
    return {
      addForm: { ...initialForm },
      initialForm: initialForm,
      loading: false,
      dialogVisible: false,
      rules: {
        number: [ { required: true, message: '请提供房间号', trigger: 'blur' } ],
        type: [ { required: true, message: '请选择房间类型', trigger: 'change' } ],
        max_people: [ { required: true, message: '请填写最大容纳人数', trigger: 'blur' } ],
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          // 【核心修正】直接发送 this.addForm，因为它的字段名 (number, type, max_people)
          // 已经和后端 POST 请求所需的参数名完全一致。
          this.req({
            url: "/rooms",
            method: "post",
            data: this.addForm
          }).then((response) => {
            if (response && response.code === 1) {
              this.$message.success('添加成功！');
              this.dialogVisible = true;
              this.resetForm();
            } else {
              this.$message.error(response.msg || '添加失败，请稍后重试');
            }
          }).catch((err) => {
            this.$message.error('请求服务器失败，请检查网络连接');
            console.error("添加房间请求失败:", err);
          }).finally(() => {
            this.loading = false;
          });
        }
      });
    },
    resetForm() {
      this.$refs.addFormRef.resetFields();
      this.addForm = { ...this.initialForm };
    }
  },
};
</script>

<style scoped>
.app-container { padding: 20px; }
.content-card { background-color: rgba(50, 50, 50, 0.4); backdrop-filter: blur(4px); border-radius: 8px; padding: 20px; color: #fff; box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); }
.card-header { font-size: 18px; font-weight: bold; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 20px; }
.add-form { margin-top: 20px; }
</style>
