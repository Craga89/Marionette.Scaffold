(function ($) {
  function SlickGridPager(dataView, grid, $container) {
    var $status;

    function init() {
      dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
        updatePager(pagingInfo);
      });

      constructPagerUI();
      updatePager(dataView.getPagingInfo());
    }

    function getNavState() {
      var cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
      var pagingInfo = dataView.getPagingInfo();
      var lastPage = pagingInfo.totalPages - 1;

      return {
        canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
        canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum != lastPage,
        canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
        canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum < lastPage,
        pagingInfo: pagingInfo
      }
    }

    function setPageSize(n) {
      dataView.setRefreshHints({
        isFilterUnchanged: true
      });
      dataView.setPagingOptions({pageSize: n});
    }

    function gotoFirst() {
      if (getNavState().canGotoFirst) {
        dataView.setPagingOptions({pageNum: 0});
      }
    }

    function gotoLast() {
      var state = getNavState();
      if (state.canGotoLast) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.totalPages - 1});
      }
    }

    function gotoPrev() {
      var state = getNavState();
      if (state.canGotoPrev) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum - 1});
      }
    }

    function gotoNext() {
      var state = getNavState();
      if (state.canGotoNext) {
        dataView.setPagingOptions({pageNum: state.pagingInfo.pageNum + 1});
      }
    }

    function constructPagerUI() {
      $container.empty();

      $('<div />', {
        'class': 'slick-pager btn-toolbar'
      })
      .append(
        $settings = $('<div />', {
          'class': 'slick-pager-nav btn-group'
        })
        .append(
          $('<button class="btn"><span class="icon-fast-backward"></span></button>').click(gotoFirst),
          $('<button class="btn"><span class="icon-step-backward"></span></button>').click(gotoPrev),
          $('<button class="btn"><span class="icon-step-forward"></span></button>').click(gotoNext),
          $('<button class="btn"><span class="icon-fast-forward"></span></button>').click(gotoLast)
        ),

        $nav = $('<div/>', {
          'class': 'slick-pager-settings btn-group'
        })
        .append(
          $('<button class="btn" data="0">All</button>'),
          $('<button class="btn" data="-1">Auto</button>'),
          $('<button class="btn" data="25">25</button>'),
          $('<button class="btn" data="50">50</button>'),
          $('<button class="btn" data="100">100</button>')
        )
        .on("click", "button[data]", function (e) {
          var pagesize = $(e.target).attr("data");
          if (pagesize != undefined) {
            if (pagesize == -1) {
              console.log(grid);
              var vp = grid.getViewport();
              setPageSize(vp.bottom - vp.top);
            } else {
              setPageSize(parseInt(pagesize));
            }
          }
        }),

        $status = $('<div/>', {
          'class': 'slick-pager-status'
        })
      )
      .appendTo($container);
    }


    function updatePager(pagingInfo) {
      var state = getNavState();

      $container.find(".slick-pager-nav .btn").removeClass("disabled");
      if (!state.canGotoFirst) {
        $container.find(".icon-fast-backward").parent().addClass("disabled");
      }
      if (!state.canGotoLast) {
        $container.find(".icon-fast-forward").parent().addClass("disabled");
      }
      if (!state.canGotoNext) {
        $container.find(".icon-step-forward").parent().addClass("disabled");
      }
      if (!state.canGotoPrev) {
        $container.find(".icon-step-backward").parent().addClass("disabled");
      }

      if (pagingInfo.pageSize == 0) {
        $status.text("Showing all " + pagingInfo.totalRows + " rows");
      } else {
        $status.text("Showing page " + (pagingInfo.pageNum + 1) + " of " + pagingInfo.totalPages);
      }
    }

    init();
  }

  // Slick.Controls.Pager
  $.extend(true, window, { Slick:{ Controls:{ Pager:SlickGridPager }}});
})(jQuery);