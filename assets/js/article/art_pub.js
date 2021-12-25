$(function () {
  initCate();
  // 初始化富文本编辑器
  initEditor();
  //获取文章类别
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('获取文章分类列表失败！');
        }
        var htmlStr = template('tpl_cate', res);
        $('[name=cate_id]').html(htmlStr);
        layui.form.render();
      }
    });
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image');

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //选择封面
  $('#chooseBtn').on('click', function () {
    $('#ArticleCover').click();
  });

  //监听封面是否被选择
  $('#ArticleCover').on('change', function (e) {
    var files = e.target.files;
    if (files.length === 0) {
      return;
    }

    var file = e.target.files[0];
    var newImgURL = URL.createObjectURL(file);
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //存为草稿
  var pub_cate = '已发布';
  $('#btn_save2').on('click', function () {
    pub_cate = '草稿';
  });

  //监听提交事件
  $('#form_pub').on('submit', function (e) {
    e.preventDefault();
    var formdata = new FormData($(this)[0]);
    formdata.append('state', pub_cate);

    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        formdata.append('cover_img', blob);
        articlePub(formdata);
      });
  });

  //   定义发布函数
  function articlePub(d) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: d,
      processData: false,
      contentType: false,
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('操作失败！');
        }
        layui.layer.msg('操作成功！');
        setTimeout(() => {
          window.parent.hrefList();
          location.href = 'art_list.html';
        }, 1000);
      }
    });
  }
});
