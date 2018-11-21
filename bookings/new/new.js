// bookings/new/new.js
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

  date_string: function (date) {
    console.log(date.toDateString);
    return date.toDateString();
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let app = getApp();
    this.setData({
      pup: app.globalData.pup,
      unavailable_dates: app.globalData.unavailable_dates
    });

      if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.setData({
      userId: app.globalData.userId
    });

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
  checkDates: function (start, end) {
    if (start === "" || end === "") {
      return false;
    }
    return !(start.getTime() <= end.getTime());
  },

  showInvalidDateModal: function (date) {
    let content = 'These dates are invalid, please pick again.';
    let page = this;
    if (date.getTime() < new Date().getTime()) {
      content = 'A date you picked is before today, please pick again.'
    }
    wx.showModal({
      content: content,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          page.setData({
            start_date: "",
            start_date_string: "",
            end_date: "",
            end_date_string: "",
            total_cost: 0
          });
        }
      }
    });
  },

  computePrice: function (start, end) {
    const date_difference = end - start;
    return (date_difference / (60 * 60 * 24 * 1000)) * this.data.pup.price;
  },

  bindStartDateChange: function (res) {
    this.setData({
      start_date: new Date(res.detail.value),
      start_date_string: res.detail.value
    });
    if (this.checkDates(this.data.start_date, this.data.end_date)) {
      this.showInvalidDateModal(this.data.start_date);
    }
  },

  bindEndDateChange: function (res) {
    console.log("changing end date to: " + res.detail.value);
    this.setData({
      end_date: new Date(res.detail.value),
      end_date_string: res.detail.value
    });

    if (this.checkDates(this.data.start_date, this.data.end_date)) {
      this.showInvalidDateModal(this.data.end_date);
    }
    let sd = new Date(this.data.start_date);
    let ed = new Date(this.data.end_date);
    let page = this;
    console.log(sd);
    console.log(ed);
    let working = true;
    console.log("Working on it...");
    while (working) {
      if (this.data.unavailable_dates.includes(ed.getTime())) {
        wx.showModal({
          content: 'These dates are unavailable, please pick again.',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              page.setData({
                start_date: "",
                start_date_string: "",
                end_date: "",
                end_date_string: ""
              });
            }
          }
        });
        console.log("it's true!!!");
        break;
      } else {
        ed.setDate(ed.getDate() - 1);
        console.log("Date is now: " + ed);
        if (ed.getTime() < sd.getTime()) {
          console.log("All clear!");

          this.setData({
            date_error: false,
            total_cost: this.computePrice(page.data.start_date, page.data.end_date)
          });
          working = false;
        }
      }
    }
  },
  submitBooking: function () {
    let pup_id = this.data.pup.id;
    let booking = { 
      user_id: this.data.userId,
      time_start: this.data.start_date,
      time_end: this.data.end_date,
      pup_id: pup_id
    }

    wx.request({
      url: `http://pups-wx.herokuapp.com/api/v1/pups/${pup_id}/bookings`,
      method: 'POST',
      data: booking,
      success(res) {
        // set data on index page and show
        wx.showToast({
          title: 'Booking made!',
          duration: 3000,
          success: function () {
            
            setTimeout(function () {
              wx.switchTab({
                url: '/users/show/show'
              });
            }, 3000);
          }
        });
        // wx.switchTab({
        //   url: '/users/show/show'
        // });
      }
    })
  },
  getUserInfo: function (e) {
    const app = getApp();
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.showToast({
      title: 'Please wait',
      duration: 5000,
      icon: 'loading',
      success: function () {

        setTimeout(function () {}, 5000);
      }
    });
  }
})