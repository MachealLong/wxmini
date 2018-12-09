// component/shareComponent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     options:{
       type:"object",
       value:{
         //分享按钮
         showShareModal: false,
         //分享Canvas区域
         showModal: false
       },
       observer: function (newValue, oldValue) {
         //如果重置属性为真,则恢复默认值
         if (newValue.showShareModal) {           
           this.setData(newValue);
         }        
         }     
     }
  },
  /**
   * 组件的初始数据
   */
  data: {
    //分享按钮
    showShareModal:false,
    width:286,
    height:514,
    //分享Canvas区域
    showModal:false,
    shareModel:{
      title:"",
      name:"",
      erweima:"",
      avator:"",
      cover:""
    }
  },
  attached:function(){
    console.log("attached");
    var that = this;
    var data = {};
    Object.assign(data, that.data.options);
    that.setData(data);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //分享给朋友圈
    shareFrends() {
      wx.showLoading({
        title: '图片生成中'
        // showShareModal: !this.data.showShareModal
      })
      let that = this;  
      let detail=that.data.shareModel;
      let post_cover = '/imgs/post_cover.png';
      wx.getImageInfo({
        src: detail.backImg,
        success: res => {                    
          detail.backImg=res.path;
          console.log(res);
          wx.getImageInfo({
            src: detail.cover,
            success: res => {
              // if (!/^https/.test(post_cover)) {
               
              // };
              detail.cover=res.path;
             
              that.setData({
                coverWidth: res.width,
                coverHeight: res.height
              });
              // that.setData({
              //   shareModel:that.shareModel
              // })
              // wx.$.fetch('api/getQrCode', {
              //   method: 'post',
              //   hideLoading: true,
              //   showLoading: true,
              //   data: {
              //     path: 'pages/topicdetail/index?id=' + this.data.id,
              //     post_id: this.data.id,
              //     width: 340
              //   }
              // }).then(res => {
              // detail.erweima = res.path;
              that.setData({
                shareModel: detail
              });
              console.log("要画canvas了");
              that.createdCode()
              setTimeout(() => {
                wx.canvasToTempFilePath({
                  x: 0,
                  y: 0,
                  canvasId: 'shareFrends',
                  success: function (res) {

                    let shareImg = res.tempFilePath;
                    that.setData({
                      shareImg: shareImg
                    })
                    that.setData({
                      showModal: true,
                      showShareModal: false
                    })
                    wx.hideLoading()
                  },
                  fail: function (res) {
                    console.log(res);
                  }
                }, this)
              }, 500)           
              // })
            },
            fail(err) {
              console.log(err)
            }
          })
        },
        fail:function(err){
          console.log(err)
        }
      })
    },
    createdCode() {
      const that = this;
      const detail = that.data.shareModel;
      //this.data.detail;
      const ctx = wx.createCanvasContext('shareFrends',this);
      const date = new Date;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const time = year + '.' + month + '.' + day;
      const name = detail.title;
      const coverWidth = this.data.coverWidth;
      const coverHeight = this.data.coverHeight;
      let pichName = detail.title;
      const explain = 'Hi,我想分享给你一条资讯猛料!';
      const erweima = detail.erweima;
      // 截取昵称 超出省略。。。
      if (pichName.length > 16) {
        pichName = pichName.slice(0, 9) + '...'
      };
      // 绘制logo
      ctx.save()
      ctx.drawImage(detail.backImg, 0, 0, 286, 514);
      //ctx.drawImage('/imgs/mango_logo.png', 230, 25, 38, 34);

      // 绘制时间
     // ctx.setFontSize(12);
     // ctx.setTextAlign('right');
      // const metrics = ctx.measureText(time).width;
      // ctx.fillText(time, 266, 78, metrics + 5);
      // 绘制 封面图并裁剪
      ctx.drawImage(detail.cover, 0, (coverWidth - 129 * coverWidth / 252) / 2, coverWidth, 129 * coverWidth / 252, 20, 94, 244, 129);


      // 绘制标题
      ctx.font = 'normal bold 14px sans-serif';
      ctx.setTextAlign('left');
      const nameWidth = ctx.measureText(name).width;
      // 标题换行
      this.wordsWrap(ctx, name, nameWidth, 272, 16, 272, 16);
      // 计算标题所占高度
      const titleHight = Math.ceil(nameWidth / 252) * 16;
      
      ctx.font = 'normal normal 10px sans-serif';
      ctx.fillText('租房子找芒果！', 65,  20+titleHight);
      ctx.fillText('租房子找芒果！', 65, 40 + titleHight);
      // 绘制头像和昵称
      // ctx.arc(36, 268 + titleHight, 20, 0, 2 * Math.PI);
      // ctx.clip()
      // ctx.drawImage(erweima, 16, 248 + titleHight, 40, 44);
      // ctx.restore();
      ctx.font = 'normal normal 12px sans-serif';
      ctx.setFillStyle('#fe785d')
      ctx.fillText(detail.price, 20, 300 + titleHight);
      ctx.font = 'normal normal 10px sans-serif';
      ctx.setFillStyle('#6a6a6a')
      ctx.fillText(detail.houseMemo, 20, 320 + titleHight);

      ctx.fillText(detail.houseMemo, 180, 320 + titleHight);
      ctx.font = 'normal normal 14px sans-serif';
      ctx.setTextAlign('left');
      ctx.setFillStyle('#bbbbbb')
      // ctx.fillText(pichName, 70, 270 + titleHight);
      // 二维码描述  及图片
      // ctx.setStrokeStyle('#eeeeee');
      // ctx.strokeRect(16, 300 + titleHight, 252, 80);
      ctx.setFillStyle('#333333')
      // ctx.fillText(explain.slice(0, 11), 30, 336 + titleHight);
      // ctx.fillText(explain.slice(11), 30, 358 + titleHight);
      
      ctx.drawImage(erweima, (that.data.width-80)/2, 360 + titleHight, 80, 80);
      ctx.setFontSize(10);
      ctx.setFillStyle('#bbbbbb')
      ctx.setTextAlign('center');          
      // console.log(fontwidth);
      ctx.fillText('长按扫码查看详情', (that.data.width/2), 460 + titleHight);
      ctx.draw()
    },
    //保存图片
    saveImg() {
      let that = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                wx.saveImageToPhotosAlbum({
                  filePath: that.data.shareImg,
                  success() {
                    wx.showToast({
                      title: '保存成功'
                    })
                    that.addShareData(false)
                  },
                  fail() {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                  }
                })
              },
              fail() {
                that.setData({
                  openSet: true
                })
              }
            })
          } else {
            wx.saveImageToPhotosAlbum({
              filePath: that.data.shareImg,
              success() {
                wx.showToast({
                  title: '保存成功'
                })
              },
              fail() {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    },
    hideModal() {
      this.setData({
        showModal: false,
        showShareModal: true
      })
    },
    hideShareModal() {
      this.setData({
        showShareModal: false
      })
    },
    // canvas 标题超出换行处理
    wordsWrap(ctx, name, nameWidth, maxWidth, startX, srartY, wordsHight) {
      let lineWidth = 0;
      let lastSubStrIndex = 0;
      for (let i = 0; i < name.length; i++) {
        lineWidth += ctx.measureText(name[i]).width;
        if (lineWidth > maxWidth) {
          ctx.fillText(name.substring(lastSubStrIndex, i), startX, srartY);
          srartY += wordsHight;
          lineWidth = 0;
          lastSubStrIndex = i;
        }
        if (i == name.length - 1) {
          ctx.fillText(name.substring(lastSubStrIndex, i + 1), startX, srartY);
        }
      }
    }
  }
})
