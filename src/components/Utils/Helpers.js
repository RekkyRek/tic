const ord = require('phpord');

export function escapeHtml(str) {
    str = str.replace(/\>/g, '\\u003e');
    str = str.replace(/\</g, '\\u003c');
    str = str.replace(/\\\u2028/g, '\\u2028');
    str = str.replace(/\\\u2029/g, '\\u2029');
    return str;
};

export function escape(str) {
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

export function ts3_base16(stri) {
    var str = require('atob')(stri);
    var convert = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
    var ret = '';
    for (var i = 0; i < 20; i++) {
        var ch = ord(str.charAt(i));
        ret += convert[(ch & 0xF0) >> 4];
        ret += convert[ch & 0x0F];
    }
    return ret;
}

export function unescape(s){
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