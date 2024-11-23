const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const Score = require('../models/score');
const Grade = require('../models/grade');

const router = new Router();
const secretKey = process.env.JWT_SECRET || 'secretKey';

// 登录接口
router.post('/login', async ctx => {
  console.log('login');
  const { exam_id, password } = ctx.request.body;
  console.log(exam_id, password);

  try {
    const score = await Score.findOne({ exam_id, password });
    if (!score) {
      ctx.status = 404;
      ctx.body = { message: '用户不存在' };
      return;
    }

    // const isMatch = await score.comparePassword(password);
    // console.log(isMatch);
    // if (!score) {
    //   ctx.status = 401;
    //   ctx.body = { message: '密码错误' };
    //   return;
    // }

    // 生成 JWT
    const token = jwt.sign(
      { id: score.exam_id, role: score.role || 'score' },
      secretKey,
      {
        expiresIn: '1h',
      }
    );
    ctx.body = { token, role: score.role };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '服务器错误' };
  }
});

// 注册接口（可选）
router.post('/register', async ctx => {
  console.log(ctx.request.body);
  const { exam_id, password, role, name, gender } = ctx.request.body;

  try {
    const score = new Score({ exam_id, password, role, name, gender });
    await score.save();
    ctx.body = { role: score.role };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: '注册失败', error: error.message };
  }
});

router.post('/query', async ctx => {
  const { exam_id } = ctx.request.body;
  console.log(exam_id);
  try {
    const query = await Grade.findOne({ exam_id: exam_id });
    if (!query) {
      ctx.status = 404;
      ctx.body = { message: '用户不存在' };
      return;
    }
    ctx.status = 200;
    ctx.body = query;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '服务器错误' };
  }
});

// 获取成绩接口
router.get('/grade', async ctx => {
  try {
    const grade = await Grade.find();
    if (!grade) {
      ctx.status = 404;
      ctx.body = { message: '用户不存在' };
      return;
    }
    ctx.status = 200;
    ctx.body = grade;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '服务器错误' };
  }
});

// 添加成绩接口
router.post('/grade', async ctx => {
  console.log(ctx.request.body);
  try {
    const grade = new Grade(ctx.request.body);
    const savaGrade = await grade.save();
    ctx.status = 201;
    ctx.body = savaGrade;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = { message: '服务器错误' };
  }
});

// 修改成绩接口
router.put('/grade/:_id', async ctx => {
  try {
    const _id = ctx.params._id;
    const updateData = ctx.request.body;
    console.log(_id, updateData);
    const updatedUser = await Grade.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      ctx.status = 404;
      ctx.body = { message: '用户不存在' };
      return;
    }
    ctx.status = 200;
    ctx.body = updatedUser;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '更新用户信息失败', error };
  }
});

// 删除成绩接口
router.delete('/grade/:_id', async ctx => {
  try {
    const _id = ctx.params._id;
    const deletedUser = await Grade.findByIdAndDelete(_id);
    if (!deletedUser) {
      ctx.status = 404;
      ctx.body = { message: '用户不存在' };
      return;
    }
    ctx.status = 200;
    ctx.body = { message: '删除成功' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '删除失败', error };
  }
});

router.get('/users', async ctx => {
  try {
    const users = await Score.find();
    if (!users) {
      ctx.status = 404;
      ctx.body = { message: '用户不存在' };
      return;
    }
    ctx.status = 200;
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '无法获取用户信息', error };
  }
});

// 更新用户信息
router.put('/users/:_id', async ctx => {
  try {
    const _id = ctx.params._id;
    const updateData = ctx.request.body;
    console.log(_id, updateData);
    if (updateData.birthDate) {
      updateData.birthDate = new Date(updateData.birthDate); // 转换为 Date 类型
    }
    const updatedUser = await Score.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      ctx.status = 404;
      ctx.body = { message: '用户不存在' };
      return;
    }
    ctx.status = 200;
    ctx.body = updatedUser;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: '更新用户信息失败', error };
  }
});

module.exports = router;
