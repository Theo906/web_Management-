$(function () {
  initCateList();
  //初始化文章列表
  function initCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        var htmlStr = template('tplCate', res);
        $('tbody').html(htmlStr);
      }
    });
  }

  var indexAdd = null;
  //   添加分类
  $('#addCateBtn').on('click', function () {
    indexAdd = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dailog_add').html()
    });
  });

  //确认添加分类
  $('body').on('submit', '#addCateForm', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('新增文章分类失败！');
        }
        initCateList();
        layui.layer.msg('新增文章分类成功！');
        layui.layer.close(indexAdd);
      }
    });
  });

  var indexEdit = null;
  var indexDelete = null;
  //修改分类
  $('tbody').on('click', '.btnEdit', function () {
    indexEdit = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dailog_edit').html()
    });
    var id = $(this).attr('data-id');
    // 根据id获取文章信息;
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        layui.form.val('formEdit', res.data);
      }
    });
  });

  //确认更新分类
  $('body').on('submit', '#editCateForm', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('更新分类信息失败！');
        }
        initCateList();
        layui.layer.msg('更新分类信息成功！');
        layui.layer.close(indexEdit);
      }
    });
  });

  //删除分类
  $('tbody').on('click', '.btn_delete', function () {
    var id = $(this).attr('data-id');
    layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layui.layer.msg('删除文章分类失败！');
          }
          initCateList();
          layui.layer.msg('删除文章分类成功！');
          layer.close(index);
        }
      });
    });
  });
});
