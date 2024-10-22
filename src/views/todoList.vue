<template>
  <div class="detail">
    <div class="detal_header">
      <div class="userName">余先生</div>
      <div class="phone"><span>13122334445</span></div>
    </div>
    <div class="content">
      <div class="left">
        <div class="todoInput">
          <el-input
            v-model="newTodoText"
            @keyup.enter.native="addnewTodo($event)"
            placeholder="请输入内容"
          ></el-input>
        </div>
        <div class="project_list">
          <div
            class="project_item"
            :class="{'isCompleted': item.completed}"
            v-for="item in projectList"
            :key="item.id"
          >
            <div
              class="checkbox"
              :class="{'checked': item.completed}"
              @click.stop="item.completed = !item.completed"
            ></div>
            <div
              class="project_content"
              @click.stop="showDrawer(item)"
            >
              <div class="title">
                <span class="todoName">{{ item.title }}</span>
              </div>
              <div class="subTitle">待办 · 剩 3 项，共5项</div>
            </div>
            <div class="customer">{{ item.parentName }}</div>
          </div>
        </div>
      </div>
      <div class="right"></div>
    </div>
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
    >
      <div
        class="drawer_content"
        v-if="activeProject.id"
      >
        <el-card shadow="hover">
          <div class="todo_header">
            <div
              class="checkbox"
              :class="{'checked': activeProject.completed}"
            ></div>
            <div class="projectInput">
              <el-input
                v-model="activeProject.title"
                placeholder="请输入内容"
              ></el-input>
            </div>
          </div>
          <!-- 在 projectTodo 区域添加 addTodo 组件 -->
          <div class="projectTodo">
            <div
              class="item"
              v-for="item in activeProject.children"
              :key="item.id"
            >
              <div
                class="checkbox"
                :class="{'checked': item.completed}"
                @click.stop="item.completed =!item.completed"
              >
              </div>
              <div class="item_content">
                <el-input
                  v-model="item.title"
                  placeholder=""
                ></el-input>
              </div>
            </div>
            <!-- 添加 addTodo 组件 -->
            <div class="addTodo">
              <el-input
                v-model="newSubTodoText"
                placeholder="请输入子项目内容"
                @keyup.enter.native="addSubTodo"
              ></el-input>
            </div>
          </div>
        </el-card>

      </div>
    </el-drawer>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

export default {
  components: {},
  name: 'todoList',
  data: function () {
    return {
      newTodoText: '',
      projectList: [
        {
          completed: false,
          id: '123456',
          title: '测试',
          // inDate: moment().format('MMM D'),
          priority: 'None',
          tags: [],
          priorityColor: '#11cdef',
          parentName: '余先生',
          children: []
        }
      ],
      customerName: '余先生',
      drawer: false,
      activeProject: {},
      newSubTodoText: ''
    }
  },
  mounted() {},
  watch: {},
  created() {},
  computed: {},
  methods: {
    addSubTodo() {
      if (this.newSubTodoText.length > 0) {
        let newSubTodo = {
          completed: false,
          id: uuidv4(),
          title: this.newSubTodoText,
          parentName: this.activeProject.title
        }
        this.activeProject.children.push(newSubTodo)
        this.newSubTodoText = ''
      }
    },
    addnewTodo(e) {
      if (this.newTodoText.length > 0) {
        e.preventDefault()
        let newTodo = {
          completed: false,
          id: uuidv4(),
          title: this.newTodoText,
          // inDate: moment().format('MMM D'),
          priority: 'None',
          tags: [],
          priorityColor: '#11cdef',
          parentName: this.customerName
        }
        this.projectList.push(newTodo)
        this.newTodoText = ''
        console.log(newTodo)
      }
    },
    showDrawer(params) {
      this.activeProject = params
      this.drawer = true
    }
  }
}
</script>


<style lang="scss" scoped>
.detal_header {
  padding: 20px 10px;
  display: flex;
  align-items: center;
  .userName {
    font-size: 32px;
    color: #333;
    margin-right: 20px;
    font-weight: bold;
  }
  .phone {
    font-size: 14px;
    color: #666;
  }
}
.todoInput {
  margin-bottom: 20px;
}
.content {
  display: flex;
  .left {
    flex: 1;
    .project_list {
      width: 100%;
      .checkbox {
        margin-top: 5px;
      }
      .project_item {
        padding: 10px 20px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        border: 1px solid #eee;
        border-radius: 4px;
        margin-top: 3px;
        background-color: #ffffff;
        &.isCompleted {
          .project_content {
            .title {
              text-decoration: line-through;
              color: #aaa;
            }
            .subTitle {
              text-decoration: line-through;
              color: #aaa;
            }
          }
        }

        .project_content {
          flex: 1;
          margin-left: 10px;
          .title {
            font-size: 18px;
            color: #333;
          }
          .subTitle {
            font-size: 12px;
            color: #666;
          }
        }
        .customer {
          color: #409eff;
          cursor: pointer;
        }
      }
    }
  }
  .right {
    flex: 1;
  }
}
.drawer_content {
  padding: 20px 10px;
  .todo_header {
    display: flex;
    align-items: center;
    .projectInput {
      margin-left: 10px;
      width: 100%;
      flex: 1;
    }
  }
}

.checkbox {
  flex-grow: 0;
  width: 16px;
  height: 16px;
  background-color: #fff;
  border: 1px solid #d8d8d8;
  border-radius: 50%;
  &::before {
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #fff;
    position: relative;
    top: 1px;
    left: 1px;
  }
  &.checked {
    width: 16px;
    height: 16px;
    background-color: #2fd2fe;
    border-radius: 50%;
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 6px;
      height: 4px;
      border: 1px solid #fff;
      border-right: none;
      border-top: none;
      transform: rotate(-60deg) translate(7px, -10px);
      position: absolute;
      top: 16px;
      left: 8.5px;
    }
  }
}
</style>
<style lang="scss">
.drawer_content {
  .el-input__inner {
    border: none;
    padding: 0;
  }
}
</style>