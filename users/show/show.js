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
    count: 0,
    currentTab: 0
  },
  navbarTap: function (e) {
    console.log
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
        let user = res.data.user;
        let i = 0;
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
      page.setData({ user: user});
        page.setBadgeNumber();
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

  setBadgeNumber: function () {
    let i = 0;
    this.data.user.pups.forEach((pup) => {
      pup.bookings.forEach((booking) => {
        if (booking.accepted === null) {
          i += 1;
        }
        return i
      })
      // return i
    })
    if (i > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: `${i}`
      })
    } else {
      wx.removeTabBarBadge({
        index: 1,
      })
    }
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
                page.setBadgeNumber();
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
                wx.setTabBarBadge({
                  index: 1,
                  text: `${Number.parseInt(wx.ta)}`
                })
              },
            });
          }
        
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },

  checkIfReviewed: function(bookingId) {
    const userReviews = this.data.user.reviews;
    return userReviews.some((review) => {
      review.booking_id === bookingId;
    });
  },

  toReview: function(e) {
    const app = getApp();
    const currBooking = this.data.user.bookings[e.currentTarget.dataset.bookingindex];
    if (currBooking.accepted) {
      if (this.checkIfReviewed(currBooking.id)) {
        app.globalData.pupForReview = this.data.user.bookings[e.currentTarget.dataset.bookingindex].pup;
        wx.navigateTo({
          url: `/reviews/new/new?booking_id=${this.data.user.bookings[e.currentTarget.dataset.bookingindex].id}`,
        });
      } else {
        wx.showModal({
          title: 'Error',
          content: "You've already reviewed this booking.",
          showCancel: false
        })
      }
    } else {
      wx.showModal({
        title: 'Error',
        content: "Can't review an unaccepted or rejected booking.",
        showCance: false
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