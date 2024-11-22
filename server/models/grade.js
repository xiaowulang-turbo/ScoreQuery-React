const mongoose = require('mongoose');

// 定义成绩的 Schema
const gradeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 学生姓名
  exam_id: { type: String, required: true }, // 考生号
  level: { type: String, required: true, enum: ['CET4', 'CET6'] }, // 考试级别
  examDate: { type: Date, required: true }, // 考试时间
  score: { type: Number, required: true }, // 考试成绩
});

// 创建一个模型
const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
