  // users/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换
    navbar: ['Your Bookings', 'Your Pups'],
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const app = getApp();

    this.setData({
      userId: app.globalData.userId
    });

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
    }});

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        userId: app.globalData.userId
      });
      this.fetchUserInfo();
      console.log("setdata");
      } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log("User info ready: ", res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          userId: app.globalData.userId
        });

        console.log("fetching info");
        this.fetchUserInfo();
      }
    } 
      else {
      // // 在没有 open-type=getUserInfo 版本的兼容处理
      // wx.getUserInfo({
      //   success: res => {
      //     app.globalData.userInfo = res.userInfo
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // })
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
  },
  fetchUserInfo: function () {
    const page = this
    wx.request({
      url: `http://pups-wx.herokuapp.com/api/v1/users/${this.data.userId}`,
      method: 'GET',
      success(res) {
        let user = res.data.user
        if (user.bookings.length > 0) {
          user.bookings = user.bookings.map(bk => {
            bk.time_start = bk.time_start.substr(0, 10)
            bk.time_end = bk.time_end.substr(0, 10)
            return bk
          });
        }
        if (user.pups.length > 0) {
          user.pups.map(pup => {
            pup.bookings = pup.bookings.map(booking => {
              booking.time_start = booking.time_start.substr(0, 10)
              booking.time_end = booking.time_end.substr(0, 10)
              return booking
            })
          });
        }
      page.setData({ user: user });
          
      },
      complete () {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      }
    });
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

        setTimeout(function () { 
        }, 5000);
      }
    });
  },

  toNewPup: function () {
    wx.navigateTo({
      url: '/pups/new/new',
    });
  },
  popup: function (e) {
    const page = this;
    const booking_id = e.currentTarget.id;
    if (e.currentTarget.dataset.accepted === null) {
      wx.showModal({
        title: 'Accept or Reject',
        showCancel: true,
        cancelText: 'No',
        cancelColor: 'green',
        confirmText: 'Yes',
        confirmColor: 'black',
        success: function (res) {
          if (res.confirm) {
            const booking = {}
            booking["accepted"] = true;
            wx.request({
              url: `http://pups-wx.herokuapp.com/api/v1/bookings/${booking_id}`,
              method: 'PUT',
              data: {
                booking
              },
              success(res) {
                page.fetchUserInfo();
              },
            });
          } else if (res.cancel) {
            const booking = {}
            booking["accepted"] = false;
            wx.request({
              url: `http://pups-wx.herokuapp.com/api/v1/bookings/${booking_id}`,
              method: 'PUT',
              data: {
                booking
              },
              success(res) {
                page.fetchUserInfo();
              },
            });
          }

        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },

  toReview: function(e) {
    console.log(e);
    const app = getApp();
    app.globalData.pupForReview = this.data.user.bookings[e.currentTarget.dataset.bookingindex].pup; 
    wx.navigateTo({
      url: `/reviews/new/new?booking_id=${this.data.user.bookings[e.currentTarget.dataset.bookingindex].id}`,
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
    const app = getApp();
    app.globalData.pupForReview = "";
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    console.log("pulled down!");
    this.fetchUserInfo();
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