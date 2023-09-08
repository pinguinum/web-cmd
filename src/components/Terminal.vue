<template>
  <div class="terminal">
    <div class="title">
      <p>Microsoft Windows [Version 10.0.19045.3324]<br/>
        (c) Корпорация Майкрософт (Microsoft Corporation). Все права защищены.</p>
    </div>
    <div class="output" v-show="isFirstIteration" v-for="item in commandHistory" :key="item.id">
      <div class="output-string">
        <p>C:\Users\pinguinum></p>
        <p>{{ item.command }}</p>
      </div>
      <div :id="currentIndex" class="response" v-html="item.response">
      </div>
      <img v-if="item.link != null" :src=item.link alt="">
    </div>
    <div class="command">
      <p>C:\Users\pinguinum></p>
      <input
          type="text"
          class="input-cursor"
          v-model="currentCommand"
          @keyup.enter="sendCommand"
          @keydown.up="showPreviousCommand"
          @keydown.down="showNextCommand"
      />
    </div>
  </div>
</template>

<script>

import {sendCommand} from '../api/api';

export default {
  data() {
    return {
      currentCommand: "",
      commandHistory: [],
      response: [],
      currentIndex: -1,
    };
  },
  methods: {
    async sendCommand() {
      const currentCommand = this.currentCommand;
      try {
        const result = await sendCommand(currentCommand);
        this.commandHistory.push({
          id: this.currentIndex,
          command: currentCommand,
          response: result.res,
          link: result.link
        });

      } catch (error) {
        console.error('Ошибка при отправке команды:', error);
      }
      this.currentCommand = "";
      this.currentIndex = this.commandHistory.length - 1;
    },
    isFirstIteration() {
      return this.currentIndex = 0;
    },
    showPreviousCommand() {
      if (this.currentIndex >= 0) {
        this.currentCommand = this.commandHistory[this.currentIndex].command;
        this.currentIndex--;
      }
    },
    showNextCommand() {
      if (this.currentIndex < this.commandHistory.length - 1) {
        this.currentIndex++;
        this.currentCommand = this.commandHistory[this.currentIndex].command;
      }
    },
  },
};
</script>

<style scoped>
.terminal {
  color: #c4c4c4;
  height: 100vh;
}

.output-string {
  align-items: center;
  display: flex;
}

.output {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.response {
  display: flex;
  margin-bottom: 15px;
  max-width: 50vh;
  flex-direction: column;
}

pre {
  font-family: Lucida Console, serif;
  font-size: 15px;
}

input[type="text"] {
  font-family: Lucida Console, serif;
  font-size: 10px;
  background-color: transparent;
  border: none;
  outline: none;
  color: #c4c4c4;
  width: 100%;
  padding: 0;
}

.command {
  display: flex;
  align-items: center;
}

img {
  max-width: 30vh;
  margin-bottom: 15px;
}

p {
  margin: 0;
}

.title {
  margin-bottom: 20px;
}
</style>