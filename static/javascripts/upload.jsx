import React from 'react';
import classNames from 'classnames'

export default class DragAndDrop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notice: 'dragNotice',
            process: 0, 
            progressShow: false,
            arrowHover: false,
            noticeShow: true,
            holderShow: true,
        };
    }

    static defaultProps = {
        notices: {
            dragNotice: 'drag files here',
            dropNotice: 'now drop!',
            multiNotice: 'one file only'
        },
        tests: {
            filereader: typeof FileReader != 'undefined',
            dnd: 'draggable' in document.createElement('span'),
            formdata: !!window.FormData,
            progress: "upload" in new XMLHttpRequest
        },
        acceptedTypes: {
            'image/png': true,
            'image/jpeg': true,
            'image/gif': true
        }
    }

    dragEnd = (event) => {
        event.preventDefault();
        this.setState({
            notice: 'dragNotice',
            arrowHover: false,
        });
    }

    dragOver = (event) => {
        event.preventDefault();
        // prevent too many ops
        if (!this.state.arrowHover) {
            this.setState({
                notice: 'dropNotice',
                arrowHover: true,
            });
        }
    }

    dragLeave = (event) => {
        event.preventDefault();
        this.setState({
            notice: 'dragNotice',
            arrowHover: false,
        });
    }

    onDrop = (event) => {
        this.readfiles(event.nativeEvent.dataTransfer.files, event);
    }

    onChange = (event) => {
        this.readfiles(event.target.files, event);
    }

    readfiles = (files, event) => {
        this.setState({holderShow: false});
        if (files.length != 1) {
            event.preventDefault();
            this.setState({notice: 'multiNotice'});
            setTimeout(() => {
                this.setState({
                    notice: 'dragNotice',
                    arrowHover: false,
                    holderShow: true,
                });
            }.bind(this), 2000);
            return
        }
        var formData = this.props.tests.formdata ? new FormData() : null;

        if (formData) {
            var file = files[0];
            formData.append('file', file);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/');
            xhr.onreadystatechange = function() {
                if ( xhr.readyState == 4 ) {
                    if ( xhr.status == 200 ) {
                        var r = JSON.parse(xhr.responseText);
                        window.location.href = r.url_s;
                    } else {
                        this.setState({
                            process: 0,
                            arrowHover: false,
                            noticeShow: true,
                            progressShow: false,
                            holderShow: true,
                        });
                        alert('上传失败，请确认上传的文件类型合法');
                    }
                }
            }.bind(this);

            if (this.props.tests.progress) {
                this.setState({
                    noticeShow: false,
                })
                xhr.upload.addEventListener('progress', this.handleProgress);
            }
            xhr.send(formData);
        }
    }

    handleProgress = (event) => {
        if (!event.lengthComputable) {
            return;
        }
        var completed = (event.loaded / event.total * 100 | 0);
        console.log('handle progress ' + completed);
        this.setState({process: completed, progressShow: true});
    }

    handlePaste = (event) => {
        if (!this.state.holderShow) {
            return;
        }
        console.log('onPaste');
        var items = event.clipboardData.items;
        var files = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (this.props.acceptedTypes[item.type]) {
                files.push(item.getAsFile());
            }
        }
        this.readfiles(files, event);
    }

    render() {
        var noticeMsg = this.props.notices[this.state.notice];
        document.onpaste = this.handlePaste;
        return (
            <div>
                { this.state.holderShow && 
                    <input type='file' id='holder'
                           onDragEnd={this.dragEnd}
                           onDragOver={this.dragOver} 
                           onDragLeave={this.dragLeave} 
                           onDrop={this.onDrop} 
                           onChange={this.onChange}/> }
                <div ref='arrow' 
                     className={classNames({
                        'arrow': true,
                        'hover': this.state.arrowHover,
                     })}>
                    <div className="alpha-bg">
                        { this.state.noticeShow && <span className="notice show">{noticeMsg}</span> }
                    </div>
                </div>
                { this.state.progressShow && <Progress completed={this.state.process}/> }
            </div>
        )
    }
};

class Progress extends React.Component {
    render() {
        var style = {
            transition: 'width 20ms',
            WebkitTransition: 'width 2ms',
            height: this.props.height || 10
        }
        return (
            <div id="progress" className="show">
                <progress id="uploadprogress" style={style} min="0" max="100" value={this.props.completed}>{this.props.children}</progress>
            </div>
        )
    }
}
