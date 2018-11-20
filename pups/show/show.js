
Page({

  /**
   * Page initial data
   */
  data: {
    today: Date.today,
    start_date: "",
    date_error: false
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

  bindStartDateChange: function (res) {
    this.setData({
      start_date: new Date(res.detail.value).toDateString()
    });
  },
  bindEndDateChange: function (res) {
    this.setData({
      end_date: new Date(res.detail.value)
    });
    console.log("end date set to: " + this.data.end_date);
    console.log(this.data.unavailable_dates);
    let sd = this.data.start_date;
    let ed = this.data.end_date;
    console.log(sd);
    console.log(ed);
    let working = true;
    console.log("Working on it...");
    while (working) {
      if (this.data.unavailable_dates.includes(ed.getTime())) {
        this.setData({
          date_error: true,
          start_date: ""
        });
        console.log("it's true!!!");
        break;
      } else {
        ed.setDate(ed.getDate() - 1);
        console.log("Date is now: " + ed);
        if (ed.getTime() < new Date(sd).getTime()) {
          console.log("All clear!");
          this.setData({
            date_error: false
          });
          working = false;
        }
      }
    }
    console.log("leaving...")
  }
})