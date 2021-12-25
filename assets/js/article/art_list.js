$(function () {
  var layer = layui.layer;
  var laypage = layui.laypage;
  //定义传递参数
  var q = {
    pagenum: 1, //页码值
    pagesize: 2, //每页显示多少条数据
    cate_id: '',
    state: ''
  };
  initTable();
  getCate();

  //筛选
  $('#searchForm').on('submit', function (e) {
    e.preventDefault();
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  //删除文章
  $('tbody').on('click', '.deleteBtn', function () {
    //获取删除按钮的个数
    var len = $('.deleteBtn').length;
    var id = $(this).attr('data-id');
    layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败！');
          }
          layer.msg('删除成功！');
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        }
      });

      layer.close(index);
    });
  });

  //   获取列表文章
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！');
        }
        var htmlStr = template('tpl_table', res);
        $('tbody').html(htmlStr);

        renderPage(res.total);
      }
    });
  }

  //获取文章分类
  function getCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败！');
        }

        var htmlStr = template('tpl_cate', res);
        $('[name=cate_id]').html(htmlStr);
        layui.form.render();
      }
    });
  }

  //渲染分页
  function renderPage(total) {
    laypage.render({
      elem: 'paging', //ID
      count: total, //数据总数
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //默认显示第几页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      }
    });
  }

  // 定义时间过滤器
  template.defaults.imports.dataFormat = function (data) {
    var time = new Date(data);
    var y = time.getFullYear();
    var m = dateZero(time.getMonth());
    var d = dateZero(time.getDate());

    var hh = dateZero(time.getHours());
    var mm = dateZero(time.getMinutes());
    var ss = dateZero(time.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  };

  //补零
  function dateZero(t) {
    return t > 9 ? t : '0' + t;
  }
});
