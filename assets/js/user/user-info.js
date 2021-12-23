$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    username: function (value) {
      if (value.length > 6) {
        return '最大长度不能超过6';
      }
    }
  });
  initUserInfo();
  //   获取用户信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！');
        }
        form.val('formUserInfo', res.data);
      }
    });
  }
  //重置用户信息
  $('#btnReset').on('click', function (e) {
    e.preventDefault();
    initUserInfo();
  });

  //监听用户信息修改
  $('.layui-form').submit(function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！');
        }

        layer.msg('更新用户信息成功！');
        window.parent.getUserInfo();
      }
    });
  });
});
