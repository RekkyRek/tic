/* App.js */

    client.connect('127.0.0.1', '25639', localStorage.getItem('ts3token'))
        .then((res)=>{
        setTimeout(()=>{
            console.log(res)
            this.setState({ client: res })
        },0)
        })

    componentDidUpdate() {
        if(this.state.client.state == 3 && this.state.cacheDir == '') {
            client.request('servervariable virtualserver_unique_identifier')
            .then((res)=>{
                console.log(res.toString())
                const cacheDir = `${require('os').homedir()}/.ts3client/cache/${btoa(client.parse(res.toString()).virtualserver_unique_identifier)}`;
                setTimeout(()=>{
                this.setState({ cacheDir })
                },50)
            })
        }
    }

/* Channel.js */

    mountListeners() {
        if(this.props.whoami.cid == this.props.channel.cid) {
            this.props.client.notifyOn('notifytalkstatuschange','schandlerid=1', (res) => {
            let udat = this.props.client.parse(res);
            let users = this.state.users;
            this.state.users.forEach(function(user) {
                if(user.clid == udat.clid) {
                users[users.indexOf(user)].client_flag_talking = udat.status;
                }
            }, this);
            this.setState({ users: users })
            })
        } else {
            setTimeout(()=>{this.mountListeners()}, 100);
        }
    }

    unmountListeners() {
        this.props.client.notifyOff('notifytalkstatuschange','schandlerid=1')
    }

    componentWillMount() {
        if(this.props.channel.cid == this.props.whoami.cid) {
        this.mountListeners();
        }
    }

    changeChannel() {
        const p = this.props;
        console.log('switch to '+p.channel.channel_name)
        this.props.client.send(`clientmove cid=${p.channel.cid} clid=${p.whoami.clid}`)
    }

/* Container.js */

    getUsers(whoami) {
        console.log('getUsewrs', whoami)
        this.props.client.request(`channelclientlist cid=${whoami.cid} -voice -uid`)
        .then((res)=>{
            console.log('usersGet', Array.isArray(this.props.client.parse(res)))
            if(Array.isArray(this.props.client.parse(res))) {
            this.setState({ users: this.props.client.parse(res) })
            this.props.setUsers(this.props.client.parse(res))
            } else {
            console.log('usersOne',  [...[this.props.client.parse(res)]])
            this.setState({ users: [...[this.props.client.parse(res)]] })
            this.props.setUsers([...[this.props.client.parse(res)]])
            }
            console.log(this.state)
            this.mountListeners();
        })
    }

    mountListeners() {
        this.props.client.notifyOn('notifyclientleftview', 'schandlerid=1', this.componentWillMount.bind(this))
        this.props.client.notifyOn('notifycliententerview', 'schandlerid=1', this.componentWillMount.bind(this))
        this.props.client.notifyOn('notifyclientmoved', 'schandlerid=1', this.componentWillMount.bind(this))
    }
    
    updateChannelsFunc (res) {
        console.log('channellist')
        if(res == undefined) {res = ()=>{};}
        const client = this.props.client;
        console.log(Object.keys(this.state.whoami).length)
        
    
        console.log('state', this.state)
        
        client.request('channellist')
        .then((re)=>{
          console.log(client.parse(re))
          console.log('state', this.state)
          client.request('whoami')
            .then((ress)=>{
              console.log(re.toString())
              this.setState({ whoami: client.parse(ress), channels: client.parse(re) })
              console.log(this.state)
              res({ whoami: client.parse(ress), channels: client.parse(re) })
            })
        })
      }

/* ChatLog.js */

    componentDidUpdate(nextProps, nextState) {
        if(this.props.users.length > 0 && nextState != this.state && this.state.messages.length > 0) {
        let logs = {};
        if(localStorage.getItem('msglogs') != undefined) {
            logs = JSON.parse(localStorage.getItem('msglogs'));
        }

        logs[this.props.users[0].cid.toString()] = this.state.messages;

        localStorage.setItem('msglogs', JSON.stringify(logs));
        }
    }

    componentWillMount() {
        if(localStorage.getItem('msglogs') != undefined) {
          let msgloop = setInterval(()=>{
            if(this.props.users.length > 0) {
              let logs = JSON.parse(localStorage.getItem('msglogs'))[this.props.users[0].cid.toString()];
              clearInterval(msgloop)
              this.setState({ messages: logs })
            }
          }, 50)
        }
    
        let reso = (res) => {
          let msg = this.props.client.parse(res.toString());
          msg.time = Date.now();
    
          this.setState({ messages: [...this.state.messages.slice(Math.max(this.state.messages.length - 49, 0)), msg] })
          
        };
        this.props.client.notifyOn('notifytextmessage','schandlerid=1', reso.bind(this));
      }
    
/* Input.js */

    escape(str) {
        let urls = str.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
        console.log(urls)
        if(urls != null) {
        urls.forEach(function(url) {
            str = str.replace(url, `[URL]${url}[/URL]`);
        }, this);
        }
        str = str.replace(/\\/g, '\\\\');
        str = str.replace(/\//g, '\\/');
        str = str.replace(/\|/g, '\\p');
        str = str.replace(/\n/g, '\\n');
        str = str.replace(/\r/g, '\\r');
        str = str.replace(/\t/g, '\\t');
        str = str.replace(/\v/g, '\\v');
        str = str.replace(/\f/g, '\\f');
        str = str.replace(/ /g, '\\s');

        return str;
    }

    if (e.keyCode == 13 && e.shiftKey == false) {
        console.log(this.props.client)
        const msg = `sendtextmessage targetmode=2 msg=${this.escape(input.value)}`;
        input.value = "";
        this.props.client.send(msg);
        document.getElementById('chatInput').style.height="31px";
        return false;
    }

/* Message.js */
    unescape(s){
        var r = String(s);
        r = r.replace(/\\s/g,  " ");	  // Whitespace
        r = r.replace(/\\p/g,  "|");    // Pipe
        r = r.replace(/\\n/g,  "\n");   // Newline
        r = r.replace(/\\f/g,  "\f");   // Formfeed
        r = r.replace(/\\r/g,  "\r");   // Carriage Return
        r = r.replace(/\\t/g,  "\t");   // Tab
        r = r.replace(/\\v/g,  "\v");   // Vertical Tab
        r = r.replace(/\\\//g, "\/");   // Slash
        r = r.replace(/\\\\/g, "\\");   // Backslash

        if(r.match(/\[URL\](.*?|\n)\[\/URL\]/g) != null) {
        r.match(/\[URL\](.*?|\n)\[\/URL\]/g).forEach(function(url) {
            let urll = url.length-6;
            r = r.replace(url, `<a alt="${url.substring(5, urll)}" href="${url.substring(5, urll)}">${url.substring(5, urll)}</a>`);

            let images = ['png', 'jpg', 'peg', 'gif'];
            if(images.indexOf(url.substring(url.length-9, urll).toLowerCase()) > -1 && this.state.msgImage == '') {
            this.setState({ msgImage: url.substring(5, urll) });
            return;
            }
            let videos = ['mp4', 'ifv', 'ebm'];
            if(videos.indexOf(url.substring(url.length-9, urll).toLowerCase()) > -1 && this.state.msgVideo == '') {
            if(url.indexOf('imgur') > -1) {
                let nurl = url.substring(5, urll).split('.');
                nurl.pop();
                url = '[URL]' + nurl.join('.') + '.mp4';
            }
            this.setState({ msgVideo: url.substring(5, urll) });
            return;
            }
            if(url.toLowerCase().indexOf('youtube') > -1 && url.toLowerCase().indexOf('?v=') > -1 && this.state.msgYoutube == '') {
            var video_id = url.split('v=')[1];
            var ampersandPosition = video_id.indexOf('&');
            if(ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            } else {
                video_id = video_id.substring(0, video_id.length - 6);
            }
            this.setState({ msgYoutube: video_id + '?autoplay=1' });
            return;
            }
            if(url.toLowerCase().indexOf('youtu.be') > -1 && this.state.msgYoutube == '') {
            var video_id = url.substring(0, url.length-6).split('/').pop();
            var ampersandPosition = video_id.indexOf('?');
            if(ampersandPosition > -1) {
                video_id += '&playsinline=0&autoplay=1'
            } else {
                video_id += '?playsinline=0&autoplay=1'
            }
            this.setState({ msgYoutube: video_id });
            return;
            }
        }, this);
        }

        return r;
    }