const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const ScoreSchema = new mongoose.Schema({
  exam_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }, // 用户角色
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  birthDate: { type: Date, required: false },
  age: { type: Number, required: false },
  registerDate: { type: Date, default: Date.now },
  avatar: { type: String, required: false }, // 头像 URL
  phone: { type: String, required: false },
});

// 加密密码
// ScoreSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// 验证密码
// ScoreSchema.methods.comparePassword = async function (inputPassword) {
//   console.log(
//     inputPassword,
//     this.password,
//     bcrypt.compare(inputPassword, this.password)
//   );
//   return bcrypt.compare(inputPassword, this.password);
// };

module.exports = mongoose.model('Score', ScoreSchema);
