import React from 'react';
import {FileCard} from './card';

export default class DragAndDrop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notice: 'dragNotice',
            process: 0, displayProcess: false,
            r: {
                filename: '',
                size: '',
                type: '',
                time: '',
                url_d: '',
                url_s: '',
                url_i: '',
                url_p: '',
                quoteurl: ''
            }
        };
        this.dragEnd = ::this.dragEnd;
        this.dragOver = ::this.dragOver;
        this.dragLeave = ::this.dragLeave;
        this.onDrop = ::this.onDrop;
        this.onChange = ::this.onChange;
        this.handleProgress = ::this.handleProgress;

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
        $(React.findDOMNode(this.refs.arrow)).removeClass('hover');
        this.setState({'notice': 'dragNotice'});
    }

    dragOver = (event) => {
        event.preventDefault();
        this.setState({'notice': 'dropNotice'});
        $(React.findDOMNode(this.refs.arrow)).addClass('hover');
    }

    dragLeave = (event) => {
        $(React.findDOMNode(this.refs.arrow)).removeClass('hover');
    }

    onDrop = (event) => {
        $(React.findDOMNode(this.refs.holder)).removeClass();
        this.readfiles(event.nativeEvent.dataTransfer.files, event);
    }

    onChange = (event) => {
        this.readfiles(event.target.files, event);
    }

    readfiles = (files, event) => {
        if (files.length != 1) {
            event.preventDefault();
            this.setState({'notice': 'multiNotice'});
            setTimeout(() => {
                this.setState({'notice': 'dragNotice'});
            }.bind(this), 1000);
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
                        $(React.findDOMNode(this.refs.holder)).hide();
                        $(React.findDOMNode(this.refs.arrow)).addClass('hide');
                        this.setState({
                            'r': JSON.parse(xhr.responseText),
                             'displayProcess': false
                         });
                    }
                    else {
                        this.setState({'process': 0});
                        alert('上传失败，请确认上传的文件类型合法');
                    }
                }
            }.bind(this);

            if (this.props.tests.progress) {
                let $arrow = $(React.findDOMNode(this.refs.arrow));
                $arrow.addClass('hide');
                $arrow.find('.notice').removeClass('show');
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
        this.setState({'process': completed, 'displayProcess': true});
    }

    render() {
        var noticeMsg = this.props.notices[this.state.notice];

        return (
            <div>
                <input type='file' onDragEnd={this.dragEnd}
                       onDragOver={this.dragOver} OnDragLeave={this.dragLeave}
                       onDrop={this.onDrop} onChange={this.onChange} ref='holder' id="holder" />
                <div className='arrow' ref='arrow'>
                    <div className="alpha-bg">
                        <span className="notice show">{noticeMsg}</span>
                    </div>
                </div>
                <Progress completed={this.state.process} show={this.state.displayProcess} />
                <FileCard filename={this.state.r.filename} size={this.state.r.size}
                          time={this.state.r.time} type={this.state.r.type}
                          url_d={this.state.r.url_d} url_p={this.state.r.url_p}
                          url_i={this.state.r.url_i} url_s={this.state.r.url_s}
                          quoteurl={this.state.r.quoteurl} />
            </div>
        )
    }
};

class Progress extends React.Component {
    render() {
        var cls;
        if ( this.props.show ) {
            cls = 'show'
        } else {
            cls = ''
        }
        var style = {
            transition: 'width 20ms',
            WebkitTransition: 'width 2ms',
            width: this.props.completed + '%',
            eight: this.props.height || 10
        }
        return (
            <div id="progress" className={cls}>
                <progress id="uploadprogress" style={{style}} min="0" max="100" value="0">{this.props.children}</progress>
            </div>
        )
    }
}
