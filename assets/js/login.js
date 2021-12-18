$(function () {
  $("#link_reg").on("click", function () {
    $(".regBox").show();
    $(".loginBox").hide();
  });

  $("#link_login").on("click", function () {
    $(".regBox").hide();
    $(".loginBox").show();
  });

  //自定义表单验证
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    repwd: function (value) {
      var pwd = $(".regBox [name=password]").val();
      if (value !== pwd) {
        return "两次密码输入不一致！";
      }
    }
  });

  //   注册请求
  $("#regForm").on("submit", function (e) {
    e.preventDefault();
    let data = {
      username: $("#regForm [name=username]").val(),
      password: $("#regForm [name=password]").val()
    };
    $.post("/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }

      layer.msg("注册成功！请登录");
      $("#link_login").click();
    });
  });

  //   登录请求
  $("#loginForm").submit(function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/api/login",
      data: $(this).serialize(),
      success: function (response) {
        if (response.status !== 0) {
          return layer.msg("登录失败！");
        }

        layer.msg("登录成功！");
        localStorage.setItem("token", response.token);
        location.href = "index.html";
      }
    });
  });
});
