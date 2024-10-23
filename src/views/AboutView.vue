<template>
  <div>
    <div class="markdown-editor">
      <textarea v-model="newNoteText"></textarea>
      <button @click="addNote">添加笔记</button>
    </div>
    <div
      class="markdown-content"
      v-if="notes.length > 0"
      v-html="md.render(notes[index].content)"
    ></div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'

export default {
  data() {
    return {
      md: new MarkdownIt(),
      newNoteText: '',
      notes: [],
      index:0
    }
  },
  methods: {
    addNote() {
      if (this.newNoteText.length > 0) {
        this.notes.push({ content: this.newNoteText, todos: [] })
        this.newNoteText = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.markdown-editor {
  margin-bottom: 20px;
}
.markdown-content {
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
