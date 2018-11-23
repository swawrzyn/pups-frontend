    // bookings/new/new.js
import initCalendar from '../../template/calendar/index';
import { disableDay } from '../../template/calendar/index';
// let conf = 


Page({
  
  conf: {
    multi: true, // Whether to enable multiple selection, 
    disablePastDay: true, // Whether to ban past dates
    defaultDay: '',

    checkConsecutive: function (allDates) {
      let outcome = allDates.every((date, index) => {
        date.setDate(date.getDate() + 1)
        if (index === (allDates.length - 1)) {
          return true;
        } else if (date.getTime() === allDates[index + 1].getTime()) {
          return true;
        } else {
          return false;
        }
      });
      return outcome;
    },

    afterTapDay: (currentSelect, allSelectedDays) => {
      const page = getCurrentPages()[getCurrentPages().length - 1];
    

      let newDates = allSelectedDays.map((date) => {
        return new Date(`${date.year}-${date.month}-${date.day}`);
      });
      newDates = newDates.sort(function (a, b) {
        return a - b;
      });
      if (page.conf.checkConsecutive(newDates)) {
        page.setData({
          validDates: true,
          start_date: newDates[0],
          end_date: newDates[newDates.length - 1],
          total_cost: page.computePrice(newDates[0], newDates[newDates.length - 1]) || 0
        });
      } else {
        page.setData({
          validDates: false
        });
      }
    },
  },
  /**
   * Page initial data
   */
  data: {
    today: Date.today,
    start_date: "",
    end_date: "",
    total_cost: 0,
    date_error: false,
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let app = getApp();
    this.setData({
    pup: app.globalData.pup,
    userId: app.globalData.userId,
    userInfo: app.globalData.userInfo
    });
    initCalendar(this.conf);
    disableDay(this.formatDates(this.data.pup.unavailable_dates));
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

  formatDates: (unavail_dates) => {
    unavail_dates = unavail_dates.map((date) => {
      date = date.split('-');
      return {year: date[0], month: date[1], day: date[2]};
    });
    return unavail_dates;
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
    return ((date_difference / (60 * 60 * 24 * 1000)) + 1) * this.data.pup.price;
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
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    const updateData = {
      avatarUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName
    }

    wx.request({
      url: `http://pups-wx.herokuapp.com/api/v1/users/${this.data.userId}`,
      method: 'PUT',
      data: updateData,
      success(res) {
        console.log("PUT to server sucess: ", res);
      },
      fail(res) {
        console.log("PUT to server sucess: ", res);
      }
    });

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