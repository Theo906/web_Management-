$.ajaxPrefilter(function (options) {
  // 配置
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
  // 添加headers
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = { Authorization: localStorage.getItem('token') || '' };
  }
  // 检验
  options.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      localStorage.removeItem('token');
      location.href = 'login.html';
    }
  };
});
