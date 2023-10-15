<template>
  <el-container direction="vertical" class="introduction-container">

    <el-main>
      <el-card shadow="hover" class="project-card">
        <h1>关于项目</h1>
        <p>这是一个由我独立开发完成的前后端分离开发的单体项目：日程管理软件ToDoList。</p>
        <p>采用“项目分类管理任务”的模式，每个任务归属于一个项目管理。</p>
        <p>使用Microsoft Azure提供的服务器，前端静态页面部署在GitHub Pages上。</p>
      </el-card>

      <el-card shadow="hover" class="contact-card">
        <h3>联系与交流</h3>
        <p>北京邮电大学</p>
        <p>计算机学院2022级本科生杨明佳</p>
        <p>查看我的项目，请访问我的 <el-link type="primary" :underline="false" href="https://github.com/greed106" target="_blank">GitHub</el-link>。</p>
        <p>需要与我联系，可通过邮箱 <el-link type="primary" :underline="false" href="mailto:yangmingjia@bupt.edu.cn">yangmingjia@bupt.edu.cn</el-link>。</p>
      </el-card>


    </el-main>

    <el-footer>
      <p>如果你有好的想法，请随时与我取得联系！</p>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'IntroductionPage'
}
</script>

<style scoped>
.introduction-container {
  max-width: 100%;
  margin: 10px auto;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.introduction-container:hover {
  box-shadow: 0 6px 25px 0 rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

h2, h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

p {
  font-size: 16px;
  line-height: 1.6;
  color: #34495e;
}

el-header {
  text-align: center;
  padding: 40px 0;
  background-color: #eaecee;  /* 添加背景色以确保内容可见性 */
  border-bottom: 1px solid #d6d6d6;
  height: auto;  /* 设定高度为自动，以适应内容 */
  overflow: hidden;  /* 防止内容溢出 */
}


.project-card, .contact-card {
  margin: 20px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

.project-card:hover, .contact-card:hover {
  transform: translateY(-5px);
}

el-footer {
  text-align: center;
  padding: 25px 0;
  background-color: #eaecee;
  border-top: 1px solid #d6d6d6;
}
</style>
