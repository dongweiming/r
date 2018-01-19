import React from 'react';

export class FileCard extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        _TYPE_ICON_SRC: {
            video  : "/static/img/video.png",
            audio  : "/static/img/audio.png",
            binary : "/static/img/binary.png",
            pdf    : "/static/img/pdf.png"
        }
    }


    componentDidUpdate() {
        history.pushState("what", "p", this.props.url_p);
    }

    render() {
        var file_icon = 'file-icon';
        var show_card = '';
        var show_image_card = '';

        if ( this.props.type === "image" ) {
            file_icon = 'file-icon invisible'
            show_image_card = 'show-card'
        }

        if ( this.props.type && this.props.type !== "image" ) {
            show_card = 'show-card';
        }

        return (
            <div>
                <div id="card" className={show_card}>
                    <div id="card-info">
                        <div className={file_icon}>
                            <img src={this.props._TYPE_ICON_SRC[this.props.type]} />
                        </div>
                        <div className="file-meta">
                            <h2 id="filename" className="filename">{this.props.filename}</h2>
                            <span id="filesize">{this.props.size}</span>
                            <span className="sep">•</span>
                            <span id="uploadtime">{this.props.time}</span>
                        </div>
                        <div className="p-link">
                            <input type="text" readOnly="true" value={this.props.url_s} id="link_s" />
                        </div>
                        <div id="action-area">
                            <a href={this.props.url_d} id="download-link">Download</a>
                            {this.props.type !== "binary" && <a ref="play" href={this.props.url_i} id="play-link">Preview</a>}
                        </div>
                    </div>
                </div>
                <ImageCard show_image_card={show_image_card} url_i={this.props.url_i}
                           image_link_input={this.props.url_s} quoteurl={this.props.quoteurl}/>
            </div>
        )
    }
}

export class ImageCard extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = ::this.onClick;
        this.state = {'zoomed': false}
    }

    onClick = (event) =>  {
        var $preview = $(React.findDOMNode(this.refs.preview));
        var $imageCard = $(React.findDOMNode(this.refs.imageCard));
        if ( !this.state.zoomed ) {
            $preview.addClass('zoomed');
            $imageCard.addClass('zoomed');
        } else {
            $preview.removeClass('zoomed');
            $imageCard.removeClass('zoomed');
            $preview.css('max-height', '');
        }
        this.setState({'zoomed': !this.state.zoomed});
    }

    render() {
        var qrURL = 'http://qr.liantu.com/api.php?el=m&text=' + this.props.image_link_input;
        return (
            <div>
                <div id="image-card" className={this.props.show_image_card} ref="imageCard">
                    <div id="image-preview" ref="preview">
                        <img src={this.props.url_i} onClick={this.onClick} ref="zoom" />
                        <div id="image-link" ref="link">
                            <input readOnly="true" type="text" value={this.props.image_link_input} />
                        </div>
                    </div>
                </div>
                { !this.state.zoomed && this.props.image_link_input !== '' ?
                    <img ref="qrcode" className="qrcode" src={qrURL} width="150" height="150" /> : null }
            </div>
        )
    }
}
