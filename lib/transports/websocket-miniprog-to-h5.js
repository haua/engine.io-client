// 把小程序的websocket变成h5的使用方式

module.exports = class WebSocket {
  /**
   * @param uri {string}
   * @param protocols
   * @param opts
   * */
  constructor (uri, protocols, opts) {
    this.binaryType = undefined
    this.supports = {
      binary: false
    }
    this.SocketTask = undefined

    this.onopen = this.onclose = this.onmessage = this.onerror = undefined

    wx.connectSocket({
      url: uri,
      header: opts.headers,
      protocols: opts.protocols || [],
      perMessageDeflate: opts.perMessageDeflate,
      timeout: opts.timeout || 10000, // 好像是只有小程序支持
      success: (d) => {
        this.SocketTask = d
        this.SocketTask.onOpen = (header, profile) => {
          this.onopen && this.onopen(header, profile)
        }
        this.SocketTask.onMessage = (data) => {
          this.onmessage && this.onmessage({data})
        }
        this.SocketTask.onError = (errMsg) => {
          this.onerror && this.onerror({errMsg})
        }
        this.SocketTask.onClose = (code, reason) => {
          this.onclose && this.onclose({code, reason})
        }
      },
      fail (res) {
        this.onerror && this.onerror({errMsg: 'wx.connectSocket失败', res})
      }
    })
  }

  send (data, opts) {
    if(this.SocketTask){
      this.SocketTask.send({
        data: data
      })
    }
  }

  close () {
    if(this.SocketTask){
      this.SocketTask.close()
    }
  }
}
