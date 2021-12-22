$(function () {
  getUserInfo();

  $('#loginOut').on('click', function () {
    layui.layer.confirm('确认退出登录吗？', { icon: 3, title: '提示' }, function (index) {
      localStorage.removeItem('token');
      location.href = 'login.html';
      layer.close(index);
    });
  });
});

//获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('登录失败！');
      }
      //渲染头像
      renderAvatar(res.data);
    }
  });
}

//渲染头像
function renderAvatar(user) {
  var name = user.username || user.nickname;
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  //判断
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text_avatar').hide();
  } else {
    $('.text_avatar').html(name[0].toUpperCase()).show();
    $('.layui-nav-img').hide();
  }
}
