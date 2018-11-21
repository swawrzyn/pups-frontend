// users/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    const page = this
    wx.request({
      url: "http://pups-wx.herokuapp.com/api/v1/users/20",
      method: 'GET',
      success(res) {
        let user = res.data.user
        user.bookings = user.bookings.map( bk => {
          bk.time_start = bk.time_start.substr(0, 10)
          bk.time_end = bk.time_end.substr(0, 10)
          return bk
        })
        user.pups.map(pup => {
          pup.bookings = pup.bookings.map( booking => {
            booking.time_start = booking.time_start.substr(0, 10)
            booking.time_end = booking.time_end.substr(0, 10)
            return booking
          }) 
        })
        
        page.setData({ user: user });
      },
      
    })

  },
  // 滑动切换tab
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },

  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})