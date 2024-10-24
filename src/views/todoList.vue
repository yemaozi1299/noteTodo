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
              <div class="subTitle">待办 · 剩 3 项，共{{item.children.length}}项</div>
            </div>
            <span
              class="priority-label"
              :style="{ backgroundColor: item.priorityColor }"
            >{{ item.priority }}</span>
            <div class="customer">{{ item.parentName }}</div>
          </div>
        </div>
      </div>
      <div class="right">
        <el-button
          type="primary"
          @click="addNote"
        >添加笔记</el-button>

        <el-card
          class="notes"
          v-for="(note, index) in notes"
          :key="note.id"
        >
          <div
            slot="header"
            class="clearfix"
          >
            <span>{{note.title}}</span>
            <el-button
              style="float: right; padding: 3px 0;color: #F56C6C;"
              type="text"
              @click="deleteNote(index)"
            >删除</el-button>
            <el-button
              style="float: right; padding: 3px 0;margin-right: 10px;"
              type="text"
              @click="editNote(index)"
            >编辑</el-button>

          </div>
          <div class="note">
            <div
              class="note-content"
              v-html="note.content"
            ></div>
          </div>
          <div>待办 · {{ note.todos.length }} 项</div>
        </el-card>
      </div>
    </div>
    <el-drawer
      :visible.sync="editorDrawer"
      :with-header="false"
      class="editor_content"
    >
      <div v-if="notes[noteIndex]">
        <el-input
          type="text"
          v-model="notes[noteIndex].title"
          style="margin-bottom: 20px;"
        ></el-input>
        <div style="border: 1px solid #ccc;margin-bottom: 20px">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 500px; overflow-y: hidden;"
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
          />
        </div>
        <div class="projectTodo">
          <div
            class="item"
            v-for="item in notes[noteIndex].todos"
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
        </div>

        <!-- 添加 addTodo 组件 -->
        <div class="addTodo">
          <el-input
            v-model="newNoteTodoText"
            placeholder="请输入子项目内容"
            @keyup.enter.native="addNoteTodo"
          ></el-input>
        </div>
        <div class="button_group">
          <el-button
            type="primary"
            @click="saveNote"
          >保存</el-button>

        </div>
      </div>
    </el-drawer>
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
    >
      <div
        class="drawer_content"
        v-if="activeProject.id"
      >
        <el-card
          shadow="hover"
          class="drawer_card"
        >
          <div class="todo_header">
            <div
              class="checkbox"
              :class="{'checked': activeProject.completed}"
              @click.stop="activeProject.completed =!activeProject.completed"
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
        <el-card
          shadow="hover"
          class="drawer_card"
        >
          <el-dropdown>
            <span class="el-dropdown-link">
              优先级：{{ activePriority }} <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changePriority('高')">高</el-dropdown-item>
              <el-dropdown-item @click.native="changePriority('中')">中</el-dropdown-item>
              <el-dropdown-item @click.native="changePriority('低')">低</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-card>
        <el-card
          shadow="hover"
          class="drawer_card"
        >
          <div class="inDate">
            {{ activeProject.inDate }}
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  components: {
    Editor,
    Toolbar
  },
  name: 'todoList',
  data: function () {
    return {
      newTodoText: '',
      projectList: [
        {
          completed: false,
          id: '123456',
          title: '测试',
          inDate: new Date().toLocaleDateString(),
          priority: '高',
          priorityColor: '#ff0000',
          parentName: '余先生',
          children: []
        }
      ],
      customerName: '余先生',
      drawer: false,
      activeProject: {},
      newSubTodoText: '',
      newNoteText: '',
      activePriority: '高', // 新增属性，用于存储当前选中项目的优先级
      // 富文本编辑器配置
      notes: [
        {
          id: '12345689',
          content: '<p>这是一个富文本编辑器的示例</p>',
          title: '测试笔记',
          todos: [
            {
              completed: false,
              id: '123456',
              title: '测试',
              inDate: new Date().toLocaleDateString()
            }
          ]
        }
      ],
      noteTitle: '',
      noteIndex: 0,
      editorDrawer: false,
      editor: null,
      html: '<p>hello</p>',
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // or 'simple'
      newNoteTodoText: ''
    }
  },
  watch: {},
  created() {},
  computed: {},
  methods: {
    // 新增方法，用于修改优先级
    changePriority(priority) {
      this.activeProject.priority = priority
      // 根据优先级更新 priorityColor
      switch (priority) {
        case '高':
          this.activeProject.priorityColor = '#ff0000'
          break
        case '中':
          this.activeProject.priorityColor = '#ffa500'
          break
        case '低':
          this.activeProject.priorityColor = '#008000'
          break
        default:
          this.activeProject.priorityColor = '#808080'
      }
      // 更新 activePriority
      this.activePriority = priority
    },
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
          inDate: new Date().toLocaleDateString(),
          priority: '低',
          priorityColor: '#008000',
          parentName: this.customerName,
          children: []
        }
        this.projectList.push(newTodo)
        this.newTodoText = ''
        console.log(newTodo)
      }
    },
    showDrawer(params) {
      this.activeProject = params
      this.drawer = true
    },
    // 笔记相关方法
    addNote() {
      this.html = '' // 清空编辑器内容
      this.editorDrawer = true // 显示抽屉
      // 确保编辑器实例存在并且已经创建
      console.log('1111')
      this.html = '<p>新笔记</p>' // 设置编辑器内容
      this.notes.push({
        id: uuidv4(),
        content: '<p>新笔记</p>',
        title: '新建笔记',
        todos: []
      })
      this.newNoteTodoText = ''
      console.log(this.notes)

      this.noteIndex = this.notes.length - 1 // 更新当前编辑的笔记索引
    },
    editNote(index) {
      // 编辑笔记的逻辑
      const note = this.notes[index]
      this.noteIndex = index
      this.html = note.content
      this.editorDrawer = true
      this.newNoteTodoText = ''
    },
    addNoteTodo() {
      if (this.newNoteTodoText.length > 0) {
        this.notes[this.noteIndex].todos.push({
          completed: false,
          id: uuidv4(),
          title: this.newNoteTodoText,
          inDate: new Date().toLocaleDateString()
        })
        this.newNoteTodoText = ''
      }
    },
    deleteNote(index) {
      // 删除笔记的逻辑
      this.notes.splice(index, 1)
    },
    addTodo(index) {
      if (this.newTodoText.length > 0) {
        this.notes[index].todos.push(this.newTodoText)
        this.newTodoText = ''
      }
    },
    saveNote() {
      // 保存笔记的逻辑
      this.notes[this.noteIndex].content = this.html
      this.editorDrawer = false
    },

    //富文本相关方法
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    }
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
    }, 1500)
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
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
  .left,
  .right {
    padding: 0 10px;
  }
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
        .priority-label {
          display: inline-block;
          padding: 2px 5px;
          margin-right: 5px;
          margin-bottom: 5px;
          font-size: 12px;
          border-radius: 4px;
          color: #fff;
          background-color: #333;
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
  .drawer_card {
    margin-bottom: 10px;
  }
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
.projectTodo {
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;

    .item_content {
      flex: 1;
      margin-left: 10px;
      .el-input {
        width: 100%;
      }
    }
  }
  .addTodo {
    margin-top: 10px;
    display: flex;
    align-items: center;
    .el-input {
      flex: 1;
      margin-right: 10px;
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
.drawer_content,
.editor_content {
  .item {
    .el-input__inner {
      border: none;
      padding: 0;
    }
  }
}
.editor_content {
  position: relative;
  .el-drawer {
    padding: 20px;
    width: 60% !important;
  }
  .button_group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    position: absolute;
    padding: 20px;
    bottom: 0px;
    left: 0px;
  }
}
.notes {
  margin-top: 20px;
}
.note {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
.note-content {
  font-size: 16px;
  margin-bottom: 10px;
}
.note-todos {
  margin-top: 10px;
}
.note-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>