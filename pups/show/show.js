
Page({

  /**
   * Page initial data
   */
  data: {
    today: Date.today,
    start_date: "",
    end_date: "",
    total_cost: 0,
    date_error: false
  },

  date_string: function(date) {
    console.log(date.toDateString);
    return date.toDateString();
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const page = this
    wx.request({
      url: `http://pups-wx.herokuapp.com/api/v1/pups/${options.id}`,
      method: 'GET',
      success(res) {
        console.log(res)
        page.setData({ 
          pup: res.data,
          unavailable_dates: res.data.unavailable_dates.map (date => new Date(date).getTime())
        });
      }
    })
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

  },

  toNewBooking: function () {
    let app = getApp();
    app.globalData.pup = this.data.pup;
    app.globalData.unavailable_dates = this.data.unavailable_dates;
    wx.navigateTo({
      url: "/bookings/new/new"
    });
  }
})