<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!--顶部菜单栏-->
        <el-menu
          style="background-color: #42b983; position: relative; z-index: 1000"
          mode="horizontal"
        >
          <!--侧边栏按钮-->
          <el-button type="text" class="icon-button" @click="drawer = !drawer">
            <i class="el-icon-s-unfold custom-icon"></i>
          </el-button>
          <!--用户信息按钮-->
          <el-button
            type="text"
            class="icon-button"
            @click="dialogVisible = true"
          >
            <i class="el-icon-user-solid custom-icon"></i>
          </el-button>
          <!--新建任务按钮-->
          <el-button
            type="text"
            class="icon-button"
            @click="addTaskDialogVisible = true"
          >
            <i class="el-icon-circle-plus custom-icon"></i>
          </el-button>
          <!--新建项目按钮-->
          <el-button
            type="text"
            class="icon-button"
            @click="addProjectDialogVisible = true"
          >
            <i class="el-icon-circle-plus-outline custom-icon"></i>
          </el-button>
        </el-menu>
      </el-col>
    </el-row>
    <!--侧边栏的内容-->
    <el-drawer
      title="侧边栏菜单"
      :visible.sync="drawer"
      direction="ltr"
      :with-header="false"
      size="61.8%"
    >
      <div class="sidebar-header">
        <p>菩提本无树</p>
        <p>明镜亦非台</p>
      </div>

      <div class="sidebar-buttons">
        <el-button
          type="primary"
          class="sidebar-button"
          @click="handleTodayTask"
          >今日待办</el-button
        >
      </div>
      <!--项目列表-->
      <div>
        <el-collapse v-model="isCollapseOpen">
          <el-collapse-item name="project">
            <template slot="title">
              <div class="project-header">项目</div>
            </template>
            <el-button
              v-for="project in projects"
              :key="project.projectId"
              type="text"
              class="project-button"
              @click="handleProjectClick(project)"
            >
              {{ project.title }}
            </el-button>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-drawer>
    <!-- 用户信息对话框 -->
    <el-dialog title="用户信息" :visible.sync="dialogVisible" width="80%">
      <el-row>
        <el-col :span="24" class="center-align">
          <el-form ref="userForm" :model="userSettings" label-width="30%">
            <el-form-item label="用户名:">
              {{ userSettings.username }}
            </el-form-item>
            <el-form-item label="电子邮箱:">
              {{ userSettings.email }}
            </el-form-item>
            <el-form-item label="注册时间:">
              {{ userSettings.registerTime }}
            </el-form-item>
            <el-form-item label="于此相遇:">
              您已加入 ToDoList {{ daysJoined }} 天
            </el-form-item>
            <el-form-item label="神奇按钮:">
              <el-button
                type="primary"
                @click="changePassword"
                class="password-button"
              >
                修改密码
              </el-button>
            </el-form-item>
            <el-form-item label="神奇按钮:">
              <el-button type="primary" @click="logout" class="password-button">
                退出登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 这里是Todo List内容 -->

    <!-- 如果todoData是空的，则显示以下内容 -->
    <div
      v-if="
        pendingTodayTodos.length === 0 &&
        completedTodayTodos.length === 0 &&
        currentView === 'today'
      "
    >
      <p>本来无一物</p>
      <p>何处惹尘埃</p>
    </div>
    <!-- 这里是今日待办内容 -->
    <div v-else-if="currentView === 'today'">
      <!-- 未过期未完成的待办任务 -->
      <el-collapse>
        <el-collapse-item name="pending">
          <template slot="title">
            <div class="task-sort-header">待办任务</div>
          </template>
          <div v-for="todo in pendingTodayTodos" :key="todo.taskId">
            <!-- 渲染任务的内容 -->
            <div class="task-container">
              <div class="task-header">
                <span class="task-title-wrapper">
                  <!-- 状态指示器 -->
                  <span
                    class="status-indicator"
                    :class="{
                      overdue: todo.overdue && !todo.completed,
                      completed: todo.completed,
                      pending: !todo.completed && !todo.overdue,
                    }"
                  ></span>
                  <span class="task-title">{{ todo.title }}</span>
                </span>

                <el-popover
                  class="custom-popover"
                  placement="left"
                  v-model="todo.visible"
                >
                  <el-button class="popover-button" @click="editTodayTodo(todo)"
                    >编辑任务</el-button
                  >
                  <el-button
                    class="popover-button"
                    @click="completeTodayTodo(todo)"
                    >完成任务</el-button
                  >
                  <el-button
                    class="popover-button"
                    @click="deleteTodayTodo(todo)"
                    >删除任务</el-button
                  >
                  <!--更多选项-按钮-->
                  <el-button
                    slot="reference"
                    icon="el-icon-more"
                    circle
                  ></el-button>
                </el-popover>
              </div>
              <div class="task-description">{{ todo.description }}</div>
              <div>
                <div class="task-time">
                  截止日期: {{ new Date(todo.endTime).toLocaleDateString() }}
                </div>
                <div class="task-time">
                  创建日期:
                  {{ new Date(todo.createdTime).toLocaleDateString() }}
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- 已完成的任务 -->
      <el-collapse>
        <el-collapse-item name="completed">
          <template slot="title">
            <div class="task-sort-header">已完成</div>
          </template>
          <div v-for="todo in completedTodayTodos" :key="todo.taskId">
            <!-- 渲染任务的内容 -->
            <div class="task-container">
              <div class="task-header">
                <span class="task-title-wrapper">
                  <!-- 状态指示器 -->
                  <span
                    class="status-indicator"
                    :class="{
                      overdue: todo.overdue && !todo.completed,
                      completed: todo.completed,
                      pending: !todo.completed && !todo.overdue,
                    }"
                  ></span>
                  <span class="task-title">{{ todo.title }}</span>
                </span>

                <el-popover
                  class="custom-popover"
                  placement="left"
                  v-model="todo.visible"
                >
                  <el-button
                    class="popover-button"
                    @click="deleteTodayTodo(todo)"
                    >删除任务</el-button
                  >
                  <!-- 更多项-按钮 -->
                  <el-button
                    slot="reference"
                    icon="el-icon-more"
                    circle
                  ></el-button>
                </el-popover>
              </div>
              <div class="task-description">{{ todo.description }}</div>
              <div>
                <div class="task-time">
                  截止日期: {{ new Date(todo.endTime).toLocaleDateString() }}
                </div>
                <div class="task-time">
                  创建日期:
                  {{ new Date(todo.createdTime).toLocaleDateString() }}
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 这里是本周计划内容 -->
    <div v-else-if="currentView === 'weekly'"></div>
    <!-- 如果currentView是projectTasks，则显示以下内容 -->
    <div v-else-if="currentView === 'projectTasks'">
      <!-- 已过期（未完成）的任务 -->
      <el-collapse>
        <el-collapse-item name="overdue">
          <template slot="title">
            <div class="task-sort-header">已过期</div>
          </template>
          <div v-for="todo in overdueTodos" :key="todo.taskId">
            <!-- 渲染任务的内容 -->
            <div class="task-container">
              <div class="task-header">
                <span class="task-title-wrapper">
                  <!-- 状态指示器 -->
                  <span
                    class="status-indicator"
                    :class="{
                      overdue: todo.overdue && !todo.completed,
                      completed: todo.completed,
                      pending: !todo.completed && !todo.overdue,
                    }"
                  ></span>
                  <span class="task-title">{{ todo.title }}</span>
                </span>

                <el-popover
                  class="custom-popover"
                  placement="left"
                  v-model="todo.visible"
                >
                  <el-button class="popover-button" @click="editTodo(todo)"
                    >编辑任务</el-button
                  >
                  <el-button class="popover-button" @click="completeTodo(todo)"
                    >完成任务</el-button
                  >
                  <el-button class="popover-button" @click="deleteTodo(todo)"
                    >删除任务</el-button
                  >
                  <!-- Trigger -->
                  <el-button
                    slot="reference"
                    icon="el-icon-more"
                    circle
                  ></el-button>
                </el-popover>
              </div>
              <div class="task-description">{{ todo.description }}</div>
              <div class="task-details">
                <div class="task-time">
                  截止日期: {{ new Date(todo.endTime).toLocaleDateString() }}
                </div>
                <div class="task-time">
                  创建日期:
                  {{ new Date(todo.createdTime).toLocaleDateString() }}
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- 未过期未完成的待办任务 -->
      <el-collapse>
        <el-collapse-item name="pending">
          <template slot="title">
            <div class="task-sort-header">待办任务</div>
          </template>
          <div v-for="todo in pendingTodos" :key="todo.taskId">
            <!-- 渲染任务的内容 -->
            <div class="task-container">
              <div class="task-header">
                <span class="task-title-wrapper">
                  <!-- 状态指示器 -->
                  <span
                    class="status-indicator"
                    :class="{
                      overdue: todo.overdue && !todo.completed,
                      completed: todo.completed,
                      pending: !todo.completed && !todo.overdue,
                    }"
                  ></span>
                  <span class="task-title">{{ todo.title }}</span>
                </span>

                <el-popover
                  class="custom-popover"
                  placement="left"
                  v-model="todo.visible"
                >
                  <el-button class="popover-button" @click="editTodo(todo)"
                    >编辑任务</el-button
                  >
                  <el-button class="popover-button" @click="completeTodo(todo)"
                    >完成任务</el-button
                  >
                  <el-button class="popover-button" @click="deleteTodo(todo)"
                    >删除任务</el-button
                  >
                  <!-- Trigger -->
                  <el-button
                    slot="reference"
                    icon="el-icon-more"
                    circle
                  ></el-button>
                </el-popover>
              </div>
              <div class="task-description">{{ todo.description }}</div>
              <div class="task-details">
                <div class="task-time">
                  截止日期: {{ new Date(todo.endTime).toLocaleDateString() }}
                </div>
                <div class="task-time">
                  创建日期:
                  {{ new Date(todo.createdTime).toLocaleDateString() }}
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- 已完成的任务 -->
      <el-collapse>
        <el-collapse-item name="completed">
          <template slot="title">
            <div class="task-sort-header">已完成</div>
          </template>
          <div v-for="todo in completedTodos" :key="todo.taskId">
            <!-- 渲染任务的内容 -->
            <div class="task-container">
              <div class="task-header">
                <span class="task-title-wrapper">
                  <!-- 状态指示器 -->
                  <span
                    class="status-indicator"
                    :class="{
                      overdue: todo.overdue && !todo.completed,
                      completed: todo.completed,
                      pending: !todo.completed && !todo.overdue,
                    }"
                  ></span>
                  <span class="task-title">{{ todo.title }}</span>
                </span>

                <el-popover
                  class="custom-popover"
                  placement="left"
                  v-model="todo.visible"
                >
                  <el-button class="popover-button" @click="deleteTodo(todo)"
                    >删除任务</el-button
                  >
                  <!-- 更多项-按钮 -->
                  <el-button
                    slot="reference"
                    icon="el-icon-more"
                    circle
                  ></el-button>
                </el-popover>
              </div>
              <div class="task-description">{{ todo.description }}</div>
              <div>
                <div class="task-time">
                  截止日期: {{ new Date(todo.endTime).toLocaleDateString() }}
                </div>
                <div class="task-time">
                  创建日期:
                  {{ new Date(todo.createdTime).toLocaleDateString() }}
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- Edit Todo Dialog -->
    <el-dialog
      title="编辑任务"
      :visible.sync="editDialogVisible"
      width="80%"
      @close="resetForm"
    >
      <el-form :model="editForm">
        <el-form-item label="任务名称">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="editForm.endTime"
            type="date"
            placeholder="选择截止日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit" class="common-button">取消</el-button>
        <el-button type="primary" @click="updateTodo" class="common-button">确认</el-button>
      </span>
    </el-dialog>
    <!-- Edit Todo Today Dialog -->
    <el-dialog
      title="编辑任务"
      :visible.sync="editTodayDialogVisible"
      width="61.8%"
      @close="resetForm"
    >
      <el-form :model="editForm">
        <el-form-item label="任务名称">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="editForm.endTime"
            type="date"
            placeholder="选择截止日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit" class="common-button">取 消</el-button>
        <el-button type="primary" @click="updateTodayTodo" class="common-button">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 新任务添加对话框 -->
    <el-dialog
      title="添加新任务"
      :visible.sync="addTaskDialogVisible"
      width="80%"
    >
      <el-form :model="newTask">
        <el-form-item label="任务标题:">
          <el-input
            v-model="newTask.title"
            placeholder="请输入任务标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务描述:">
          <el-input
            v-model="newTask.description"
            placeholder="请输入任务描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="截止日期:">
          <el-date-picker
            v-model="newTask.endTime"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目选择:">
          <el-select v-model="newTask.projectId" placeholder="请选择项目">
            <el-option
              v-for="project in projects"
              :key="project.projectId"
              :label="project.title"
              :value="project.projectId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTaskDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewTask">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新项目添加对话框 -->
    <el-dialog
      title="添加新项目"
      :visible.sync="addProjectDialogVisible"
      width="80%"
    >
      <el-form :model="newTask">
        <el-form-item label="项目标题:">
          <el-input
            v-model="newProject.title"
            placeholder="请输入项目标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目描述:">
          <el-input
            v-model="newProject.description"
            placeholder="请输入项目描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTaskDialogVisible = false" class="common-button">取 消</el-button>
        <el-button type="primary" @click="addNewProject" class="common-button">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="isChangePasswordDialogVisible"
      width="80%"
      @close="isChangePasswordDialogVisible = false"
    >
      <el-form label-width="80px" label-position="left">
        <el-form-item label="新密码">
          <el-input
            v-model="newPassword"
            type="password"
            autocomplete="off"
            placeholder="请输入新密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>

        <el-form-item label="再次确认">
          <el-input
            v-model="confirmNewPassword"
            type="password"
            autocomplete="off"
            placeholder="请再次输入新密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isChangePasswordDialogVisible = false" class="common-button"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmChangePassword" class="common-button"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { format } from "date-fns";
export default {
  name: "HomeView",
  async mounted() {
    // 从 localStorage 中获取 username和jwt
    this.userSettings.username = localStorage.getItem("username");
    const jwt = localStorage.getItem("jwt");
    const username = this.userSettings.username;
    // 将获取到的jwt加入请求头中
    this.$axios.defaults.headers.common["Authorization"] = jwt;
    // 如果不存在，说明用户没有登录，跳转到登录页面
    if (!username || !jwt || username.trim() === "" || jwt.trim() === "") {
      this.$message.error("请先登录");
      this.$router.push("/login");
    } else if (!(await this.validJwt(jwt, username))) {
      // 使用 await 获取 validJwt 的结果
      this.$message.error("登录已过期，请重新登录");
      this.$router.push("/login");
    } else {
      // 如果存在，说明用户已经登录

      // 获取今日待办
      // this.fetchTodayTodo();

      // 获取用户信息
      this.fetchUserInfo();

      // 获取项目列表
      await this.fetchProjects();

      this.handleTodayTask();
    }
  },
  data() {
    return {
      drawer: false,
      dialogVisible: false,
      currentView: "today",
      userSettings: {
        username: "",
        email: "",
        registerTime: "",
      },
      isCollapseOpen: ["project"], // 默认展开的折叠项的 name 值
      projects: null,
      todoData: null,

      overdueTodos: [], // 已过期（未完成）的任务
      pendingTodos: [], // 未过期未完成的待办任务
      completedTodos: [], // 已完成的任务

      pendingTodayTodos: [], // 未过期未完成的待办任务
      completedTodayTodos: [], // 已完成的任务

      currentTodo: null,
      editDialogVisible: false,
      editTodayDialogVisible: false,
      editForm: {
        taskId: null,
        projectId: null,
        title: "",
        description: "",
        overdue: null,
        completed: null,
        endTime: "",
      },

      addTaskDialogVisible: false,
      addProjectDialogVisible: false,
      newTask: {
        title: "",
        description: "",
        endTime: "",
        projectId: null,
      },
      newProject: {
        title: "",
        description: "",
      },
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000;
        },
      },

      isChangePasswordDialogVisible: false,
      newPassword: "",
      confirmNewPassword: "",
    };
  },
  computed: {
    // 计算用户加入 ToDoList 多少天
    daysJoined() {
      const registrationDate = new Date(this.userSettings.registerTime);
      const currentDate = new Date();
      const timeDiff = currentDate - registrationDate;
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      return days;
    },
  },
  methods: {
    async fetchUserInfo() {
      // 获取 username
      const username = this.userSettings.username;
      try {
        // 发送 POST 请求到你的后端服务器
        const response = await this.$axios.post(
          "https://greed106.conc.tech/todolist/userinfo",
          { username }
        );

        // 检查 response.data.code 的值是否为 1
        if (response.data.code === 1) {
          // 如果请求成功，从 response.data.data 更新 userSettings 的值
          this.userSettings = {
            username: response.data.data.username,
            email: response.data.data.email,
            registerTime: new Date(
              response.data.data.createdTime
            ).toLocaleDateString(),
          };
          //展示表格
          //this.dialogVisible = true;
        } else {
          // 如果请求失败，你可能想要显示一个错误消息
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.msg);
        } else {
          this.$message.error(error);
        }
      }
    },
    changePassword() {
      // 处理修改密码的逻辑
      this.isChangePasswordDialogVisible = true;
    },
    confirmChangePassword() {
      // TODO: 添加密码修改的实际逻辑
      // 验证密码
      if (this.newPassword !== this.confirmNewPassword) {
        this.$message.error("两次输入的密码不一致");
        return;
      }
      // 检测输入为空
      if (!this.newPassword || !this.confirmNewPassword) {
        this.$message.error("密码不能为空");
        return;
      }
      // 发送axios请求：
      this.$axios
        .put("https://greed106.conc.tech/todolist/updateuser", {
          username: this.userSettings.username,
          password: this.newPassword,
        })
        .then((response) => {
          if (response.data.code === 1) {
            this.$message.success("密码修改成功");
            this.isChangePasswordDialogVisible = false; // 关闭对话框
          } else {
            this.$message.error("密码修改失败: " + response.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error("密码修改失败: " + error);
        });
      this.isChangePasswordDialogVisible = false; // 关闭对话框
    },
    logout() {
      // 处理登出的逻辑
      // 清除 localStorage 中的 jwt 和 username
      localStorage.removeItem("jwt");
      localStorage.removeItem("username");
      // 跳转到登录页面
      this.$router.push("/login");
    },

    addNewTask() {
      const { title, description, endTime, projectId } = this.newTask;
      // 你可能需要把 endTime 转换为你的后端需要的格式
      if (!title) {
        this.$message.error("任务标题不能为空");
        return;
      }
      if (!description) {
        this.$message.error("任务描述不能为空");
        return;
      }
      if (!endTime) {
        this.$message.error("截止日期不能为空");
        return;
      }
      if (!projectId) {
        this.$message.error("项目不能为空");
        return;
      }
      const currentDateTime = new Date();
      const selectedDateTime = new Date(endTime);
      selectedDateTime.setHours(currentDateTime.getHours());
      selectedDateTime.setMinutes(currentDateTime.getMinutes());
      selectedDateTime.setSeconds(currentDateTime.getSeconds());
      this.userSettings.username = localStorage.getItem("username");
      this.$axios
        .post("https://greed106.conc.tech/todolist/addtask", {
          title,
          description,
          projectId,
          completed: false, // 假设新任务默认为未完成
          createdTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
          updatedTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
          endTime: format(selectedDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
          overdue: false, // 假设新任务默认不过期
          username: this.userSettings.username,
        })
        .then((response) => {
          if (response.data.code === 1) {
            this.$message.success("任务添加成功");
            this.addTaskDialogVisible = false;
            // 你可能还想在这里清除 newTask 数据，以便下次打开对话框时字段是清空的
            this.newTask = { title: "", description: "", endTime: "" };
            // 你可能还想刷新你的任务列表来显示新添加的任务
            this.$router.push("/");
          } else {
            this.$message.error("任务添加失败: " + response.data.msg);
          }
        })
        .catch((error) => {
          this.$message.error("任务添加失败: " + error);
        });
    },
    async addNewProject() {
      const { title, description } = this.newProject;
      if (!title) {
        this.$message.error("项目标题不能为空");
        return;
      }
      if (!description) {
        this.$message.error("项目描述不能为空");
        return;
      }
      try {
        const response = await this.$axios.post(
          "https://greed106.conc.tech/todolist/addproject",
          {
            title,
            description,
            username: this.userSettings.username,
          }
        );
        if (response.data.code === 1) {
          this.$message.success("项目添加成功");
          this.addProjectDialogVisible = false;
          // 你可能还想在这里清除 newProject 数据，以便下次打开对话框时字段是清空的
          this.newProject = { title: "", description: "" };
          // 你可能还想刷新你的项目列表来显示新添加的项目
          this.$router.push("/");
        } else {
          this.$message.error("项目添加失败: " + response.data.msg);
        }
      } catch (error) {
        this.$message.error("项目添加失败: " + error);
      }
    },
    async validJwt(jwt, username) {
      try {
        const response = await this.$axios.post(
          "https://greed106.conc.tech/todolist/validjwt",
          { jwt, username }
        );
        return response.data.code === 1;
      } catch (error) {
        this.$message.error(error);
        return false; // 当请求失败时返回 false
      }
    },
    async fetchProjects() {
      try {
        const response = await this.$axios.post(
          "https://greed106.conc.tech/todolist/getproject",
          {
            username: this.userSettings.username,
          }
        );

        if (response.data.code === 1) {
          this.projects = response.data.data;
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.msg);
        } else {
          this.$message.error("获取项目列表失败");
        }
      }
    },
    handleProjectClick(project) {
      console.log("我被调用了");
      this.overdueTodos = project.tasks.filter(
        (task) => task.overdue && !task.completed
      );
      this.pendingTodos = project.tasks.filter(
        (task) => !task.overdue && !task.completed
      );
      this.completedTodos = project.tasks.filter((task) => task.completed);

      // 可能需要切换视图
      this.currentView = "projectTasks"; // 或其他名称，取决于你的需求
      this.drawer = false;
    },
    handleTodayTask() {
      //遍历projects中的每个project的每个task
      //将endtime为今日的且completed为false的task放入pendingTodayTodos中
      //将endtime为今日的且completed为true的task放入completedTodayTodos中
      const today = new Date().toDateString(); // Gives format 'yyyy-MM-dd'

      this.pendingTodayTodos = []; // Assuming you have these arrays defined in your data
      this.completedTodayTodos = [];

      this.projects.forEach((project) => {
        project.tasks.forEach((task) => {
          const taskDate = new Date(task.endTime).toDateString();
          if (taskDate === today) {
            if (task.completed) {
              this.completedTodayTodos.push(task);
            } else {
              this.pendingTodayTodos.push(task);
            }
          }
        });
      });
      this.currentView = "today";
      this.drawer = false;
    },

    cancelEdit() {
      this.editDialogVisible = false;
      this.editTodayDialogVisible = false;
      this.$message.info("取消修改");
    },
    editTodo(todo) {
      // Open the dialog and populate the form
      this.editForm.taskId = todo.taskId;
      this.editForm.projectId = todo.projectId;
      this.editForm.title = todo.title;
      this.editForm.description = todo.description;
      this.editForm.overdue = todo.overdue;
      this.editForm.completed = todo.completed;
      this.editForm.endTime = todo.endTime;
      this.editDialogVisible = true;
      // 创建对todo的引用
      this.currentTodo = todo;
    },
    editTodayTodo(todo) {
      // Open the dialog and populate the form
      this.editForm.taskId = todo.taskId;
      this.editForm.projectId = todo.projectId;
      this.editForm.title = todo.title;
      this.editForm.description = todo.description;
      this.editForm.overdue = todo.overdue;
      this.editForm.completed = todo.completed;
      this.editForm.endTime = todo.endTime;
      this.editTodayDialogVisible = true;
      // 创建对todo的引用
      this.currentTodo = todo;
    },
    resetForm() {
      this.editForm = {
        taskId: null,
        projectId: null,
        title: "",
        description: "",
        overdue: null,
        completed: null,
        endTime: "",
      };
      this.currentTodo = null;
    },
    isOverdue(endTime) {
      const today = new Date().toDateString(); // Gives format 'yyyy-MM-dd'
      const taskDate = new Date(endTime).toDateString();
      if (taskDate < today) {
        return true;
      } else {
        return false;
      }
    },
    async updateTodo() {
      var time = new Date(this.editForm.endTime);
      //将时间设置为现在的时间
      time.setHours(new Date().getHours());
      time.setMinutes(new Date().getMinutes());
      time.setSeconds(new Date().getSeconds());
      try {
        const response = await this.$axios.put(
          "https://greed106.conc.tech/todolist/updatetask",
          {
            taskId: this.editForm.taskId,
            projectId: this.editForm.projectId,
            title: this.editForm.title,
            description: this.editForm.description,
            overdue: this.editForm.overdue,
            completed: this.editForm.completed,
            endTime: format(time, "yyyy-MM-dd'T'HH:mm:ss"),
          }
        );

        if (response.data.code === 1) {
          this.$message.success("任务已更新");
          this.editDialogVisible = false;

          if (this.currentTodo) {
            this.currentTodo.title = this.editForm.title;
            this.currentTodo.description = this.editForm.description;
            this.currentTodo.overdue = this.editForm.overdue;
            this.currentTodo.completed = this.editForm.completed;
            this.currentTodo.endTime = time;
            // 遍历projects以找到并更新相应的任务
            this.projects.forEach((project) => {
              project.tasks.forEach((task) => {
                if (task.taskId === this.currentTodo.taskId) {
                  task.title = this.editForm.title;
                  task.description = this.editForm.description;
                  task.overdue = this.isOverdue(time);
                  task.completed = this.editForm.completed;
                  task.endTime = time;
                  this.handleProjectClick(project);
                }
              });
            });

            // 在这里，你不再需要单独处理pendingTodos和overdueTodos，
            // 因为它们基于projects的数据，所以会自动更新。
            // 如果你在其他地方依赖于这两个数组，你可能需要更新它们。
          }

          this.resetForm();
        } else {
          this.$message.error("更新失败: " + response.data.msg);
        }
      } catch (error) {
        this.$message.error("更新失败: " + error);
      }
    },
    async updateTodayTodo() {
      var time = new Date(this.editForm.endTime);
      //将时间设置为现在的时间
      time.setHours(new Date().getHours());
      time.setMinutes(new Date().getMinutes());
      time.setSeconds(new Date().getSeconds());
      try {
        const response = await this.$axios.put(
          "https://greed106.conc.tech/todolist/updatetask",
          {
            taskId: this.editForm.taskId,
            projectId: this.editForm.projectId,
            title: this.editForm.title,
            description: this.editForm.description,
            overdue: this.editForm.overdue,
            completed: this.editForm.completed,
            endTime: format(time, "yyyy-MM-dd'T'HH:mm:ss"),
          }
        );

        if (response.data.code === 1) {
          this.$message.success("任务已更新");
          this.editTodayDialogVisible = false;

          if (this.currentTodo) {
            this.currentTodo.title = this.editForm.title;
            this.currentTodo.description = this.editForm.description;
            this.currentTodo.overdue = this.editForm.overdue;
            this.currentTodo.completed = this.editForm.completed;
            this.currentTodo.endTime = time;
            // 遍历projects以找到并更新相应的任务
            this.projects.forEach((project) => {
              project.tasks.forEach((task) => {
                if (task.taskId === this.currentTodo.taskId) {
                  task.title = this.editForm.title;
                  task.description = this.editForm.description;
                  task.overdue = this.isOverdue(time);
                  task.completed = this.editForm.completed;
                  task.endTime = time;
                  this.handleTodayTask();
                }
              });
            });

            // 在这里，你不再需要单独处理pendingTodos和overdueTodos，
            // 因为它们基于projects的数据，所以会自动更新。
            // 如果你在其他地方依赖于这两个数组，你可能需要更新它们。
          }

          this.resetForm();
        } else {
          this.$message.error("更新失败: " + response.data.msg);
        }
      } catch (error) {
        this.$message.error("更新失败: " + error);
      }
    },
    async completeTodo(todo) {
      try {
        const response = await this.$axios.put(
          "https://greed106.conc.tech/todolist/updatetask",
          {
            taskId: todo.taskId,
            completed: true,
          }
        );
        if (response.data.code === 1) {
          this.$message.success("任务已完成");
          todo.visible = false;
          // 遍历projects以找到并更新相应的任务
          this.projects.forEach((project) => {
            project.tasks.forEach((task) => {
              if (task.taskId === todo.taskId) {
                task.completed = true;
                this.handleProjectClick(project);
              }
            });
          });

          // 在这里，你不再需要单独处理pendingTodos和overdueTodos，
          // 因为它们基于projects的数据，所以会自动更新。
          // 如果你在其他地方依赖于这两个数组，你可能需要更新它们。
        } else {
          this.$message.error("更新失败: " + response.data.msg);
        }
      } catch (error) {
        this.$message.error("更新失败: " + error);
      }
    },
    async completeTodayTodo(todo) {
      try {
        const response = await this.$axios.put(
          "https://greed106.conc.tech/todolist/updatetask",
          {
            taskId: todo.taskId,
            completed: true,
          }
        );
        if (response.data.code === 1) {
          this.$message.success("任务已完成");
          todo.visible = false;
          // 遍历projects以找到并更新相应的任务
          this.projects.forEach((project) => {
            project.tasks.forEach((task) => {
              if (task.taskId === todo.taskId) {
                task.completed = true;
                this.handleTodayTask();
              }
            });
          });

          // 在这里，你不再需要单独处理pendingTodos和overdueTodos，
          // 因为它们基于projects的数据，所以会自动更新。
          // 如果你在其他地方依赖于这两个数组，你可能需要更新它们。
        } else {
          this.$message.error("更新失败: " + response.data.msg);
        }
      } catch (error) {
        this.$message.error("更新失败: " + error);
      }
    },
    async deleteTodo(todo) {
      try {
        const response = await this.$axios.delete(
          "https://greed106.conc.tech/todolist/deletetask",
          {
            data: {
              taskId: todo.taskId,
            },
          }
        );
        if (response.data.code === 1) {
          this.$message.success("删除成功");

          // 遍历projects以找到并删除相应的任务
          this.projects.forEach((project) => {
            const taskIndex = project.tasks.findIndex(
              (task) => task.taskId === todo.taskId
            );
            if (taskIndex !== -1) {
              project.tasks.splice(taskIndex, 1);
              // 这一步可能不是必要的，但为了保持与之前的逻辑一致
              this.handleProjectClick(project);
            }
          });

          // 在这里，你不再需要单独处理pendingTodos, overdueTodos和completedTodos，
          // 因为它们基于projects的数据，所以会自动更新。
          // 如果你在其他地方依赖于这些数组，你可能需要更新它们。
        } else {
          this.$message.error("删除失败: " + response.data.msg);
        }
      } catch (error) {
        this.$message.error("删除失败: " + error);
      }
    },
    async deleteTodayTodo(todo) {
      try {
        const response = await this.$axios.delete(
          "https://greed106.conc.tech/todolist/deletetask",
          {
            data: {
              taskId: todo.taskId,
            },
          }
        );
        if (response.data.code === 1) {
          this.$message.success("删除成功");

          // 遍历projects以找到并删除相应的任务
          this.projects.forEach((project) => {
            const taskIndex = project.tasks.findIndex(
              (task) => task.taskId === todo.taskId
            );
            if (taskIndex !== -1) {
              project.tasks.splice(taskIndex, 1);
              // 这一步可能不是必要的，但为了保持与之前的逻辑一致
              this.handleTodayTask();
            }
          });

          // 在这里，你不再需要单独处理pendingTodos, overdueTodos和completedTodos，
          // 因为它们基于projects的数据，所以会自动更新。
          // 如果你在其他地方依赖于这些数组，你可能需要更新它们。
        } else {
          this.$message.error("删除失败: " + response.data.msg);
        }
      } catch (error) {
        this.$message.error("删除失败: " + error);
      }
    },
  },
};
</script>

<style scoped>
/* 自定义图标样式 */
.custom-icon {
  font-size: 24px; /* 调整图标大小 */
  color: black; /* 调整图标颜色 */
}

.center-align {
  text-align: center;
}

.password-button {
  background-color: #42b983;
  color: #fff;
}

.password-button:hover {
  background-color: #356859;
}

.sidebar-header {
  font-size: larger;
  font-weight: 900;
  text-align: center;
  margin-bottom: 20px;
}

.sidebar-buttons {
  margin-bottom: 20px;
}

.sidebar-button {
  width: 90%;
  background-color: #42b983;
  margin-bottom: 5px;
  margin-top: 5px;
  margin-left: 0;
  border: black;
  font-size: medium;
}
.sidebar-button:hover {
  background-color: #356859;
}
.sidebar-projects {
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.project-button {
  text-align: left;
  width: 100%;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 15%;
  font-size: medium;
}
.project-header {
  text-align: left; /* "项目"文本左对齐 */
  margin-left: 20px; /* "项目"文本左边距 */
  /*增大字体*/
  font-size: 20px;
  /*加粗*/
  font-weight: 900;
}
.task-sort-header {
  text-align: left;
  margin-left: 5px;
  font-size: larger;
  font-weight: bold;
}

.task-container {
  padding: 10px;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: box-shadow 0.3s ease;
}

.task-container:hover {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-title {
  font-weight: bold; /* 加粗 */
  font-size: large; /* 加大，您可以根据需要调整 */
  color: black; /* 加黑 */
  vertical-align: middle; /* 使其与状态指示灯水平对齐 */
  margin-left: 4px; /* 如果需要，为其添加左边距 */
}

.task-title-wrapper {
  display: inline-block;
  vertical-align: middle; /* 对齐方式 */
}

.task-description {
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: medium;
}

.task-time {
  font-size: small;
  color: grey;
}
.status-indicator {
  display: inline-block; /* 使其成为内联块状元素，这样就可以调整宽度和高度 */
  width: 16px; /* 圆的直径 */
  height: 16px; /* 圆的直径 */
  border-radius: 50%; /* 使其成为一个完美的圆 */
  margin-right: 4px; /* 如果需要的话，可以设置右边距以和标题之间有一些间距 */
  vertical-align: middle; /* 垂直对齐于文本行的中部 */
}

.status-indicator.completed {
  background-color: green;
}

.status-indicator.overdue {
  background-color: red;
}

.status-indicator.pending {
  background-color: #ffc300;
}

.custom-popover .el-popper {
  width: 150px; /* 调整为您想要的宽度 */
  max-height: 300px; /* 如果需要，也可以设置最大高度 */
  overflow-y: auto; /* 如果内容超出最大高度，则允许滚动 */
}

.popover-button {
  display: block; /* 使按钮占据整个行宽，形成“块”效果 */
  width: 100%; /* 使用全宽 */
  margin: 5px 0; /* 为按钮上下添加一些间距，使其看起来更加整洁 */
  text-align: center; /* 左对齐文本 */
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* 提供按钮之间的空间 */
}

/* 提供表单项目之间的空间 */
.el-form-item {
  margin-bottom: 20px;
}
.common-button {
  border-radius: 5px;
  background-color: #42b983;
  color: #fff;
  transition: background-color 0.3s;
  font-size: 16px; /* 增大字体大小 */
}

.common-button:hover {
  background-color: #356859;
}
</style>