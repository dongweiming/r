import React from 'react';
import classNames from 'classnames'
import {FileCard} from './card';

export default class DragAndDrop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notice: 'dragNotice',
            process: 0, 
            progressShow: false,
            arrowHover: false,
            arrowShow: true,
            noticeShow: true,
            holderShow: true,
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
        this.setState({
            notice: 'dragNotice',
            arrowHover: false,
        });
    }

    dragOver = (event) => {
        event.preventDefault();
        this.setState({
            notice: 'dragNotice',
            arrowHover: true,
        });
    }

    dragLeave = (event) => {
        this.setState({
            arrowHover: false,
        });
    }

    onDrop = (event) => {
        console.log('onDrop')
        this.readfiles(event.nativeEvent.dataTransfer.files, event);
    }

    onChange = (event) => {
        console.log('onChange')
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
                        this.setState({
                            r: JSON.parse(xhr.responseText),
                            progressShow: false,
                            showArrow: false,
                         });
                    } else {
                        this.setState({
                            process: 0,
                            arrowShow: true,
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
                    arrowShow: false,
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

    render() {
        var noticeMsg = this.props.notices[this.state.notice];
        return (
            <div>
                <input type='file' onDragEnd={this.dragEnd}
                       onDragOver={this.dragOver} onDragLeave={this.dragLeave}
                       onChange={this.onChange} id='holder'/>
                <div className={classNames({
                        'arrow': true,
                        'hover': this.state.arrowHover,
                        'hide': !this.state.arrowShow,
                    })} ref='arrow'>
                    <div className="alpha-bg">
                        <span className="notice show">{noticeMsg}</span>
                    </div>
                </div>
                { this.state.progressShow && <Progress completed={this.state.process}/> }
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
