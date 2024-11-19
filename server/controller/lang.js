const { read, save } = require('../lib/util');

const FILE_NAME = 'lang';
const ERROR_MESSAGES = {
  INVALID_LANG: 'lang is not valid',
};

/**
 * 设置语言
 * @param {object} ctx - 上下文对象
 */
const setLang = async ctx => {
  try {
    const whiteList = ['zh', 'en'];
    const { lang = '' } = ctx.request.body;
    const data = read(FILE_NAME);
    if (!whiteList.includes(lang)) {
      throw { status: 400, message: ERROR_MESSAGES.INVALID_LANG };
    }
    data.lang = lang;
    save(data, FILE_NAME);
    ctx.body = {
      code: 201,
      msg: 'success',
    };
  } catch (error) {
    throw error;
  }
};

/**
 * 获取语言
 * @param {object} ctx - 上下文对象
 */
const getLang = async ctx => {
  try {
    const { lang } = read(FILE_NAME);
    ctx.body = {
      code: 200,
      msg: 'success',
      data: lang,
    };
  } catch (error) {
    throw error;
  }
};

exports.getLang = getLang;
exports.setLang = setLang;
