import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Gif, ImageFrame, loadGif, loadImage } from './image_loader';
import LabeledSlider from './labeled_slider';
import LoadingSpinner from './loading_spinner';
import GifPlayer from './gif_player';
import GifPicker from "./gif_picker";
const Dropzone = require('react-dropzone')

interface ViewerState {
    image: string

    imageData: ImageFrame | null

    outputWidth: number
    outputHeight: number

    loadingGif: boolean
    dropzoneActive: boolean

    error?: string
}

class Viewer extends React.Component<null, ViewerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            image: './images/mandrill.png',

            imageData: null,

            outputWidth: 1,
            outputHeight: 1,

            dropzoneActive: false,
            loadingGif: false
        }
    }

    componentDidMount() {
        this.loadImage(this.state.image)
    }

    private loadImage(gif: string) {
        this.setState({ loadingGif: true })

        return (
            gif && this.state.imageData && this.state.imageData.source === gif
                ? Promise.resolve(this.state.imageData)
                : loadImage(gif, true)
        )
            .then(leftData => {
                if (gif !== this.state.image)
                    return

                this.setState({
                    imageData: leftData,

                    outputWidth: leftData.width,
                    outputHeight: leftData.height,

                    loadingGif: false,
                    error: null
                })
            })
            .catch(e => {
                if (gif !== this.state.image)
                    return

                console.error(e)
                this.setState({
                    imageData: null,

                    loadingGif: false,
                    error: 'Could not load gif'
                })
            });
    }

    private onImageChanged(src: string) {
        this.setState({
            image: src
        })

        this.loadImage(src)
    }

    private onWidthChange(value: number): void {
        const newHeight = Math.ceil(this.state.imageData.width * this.state.imageData.height / value)
        this.setState({
            outputWidth: value,
            outputHeight: newHeight
        })
    }

    private onHeightChange(value: number): void {
        const newWidth = Math.ceil(this.state.imageData.width * this.state.imageData.height / value)
        this.setState({
            outputWidth: newWidth,
            outputHeight: value
        })
    }

    private onReset() {
        this.setState({
            outputWidth: this.state.imageData.width,
            outputHeight: this.state.imageData.height
        })
    }

    onDragEnter() {
        this.setState({
            dropzoneActive: true
        });
    }

    onDragLeave() {
        this.setState({
            dropzoneActive: false
        });
    }

    onDrop(files: any[]) {
        if (files.length) {
            this.onImageChanged(window.URL.createObjectURL(files[0]))
        }

        this.setState({ dropzoneActive: false })
    }

    render() {
        return (
            <Dropzone
                disableClick
                style={{}}
                accept='image/*'
                onDrop={this.onDrop.bind(this)}
                onDragEnter={this.onDragEnter.bind(this)}
                onDragLeave={this.onDragLeave.bind(this)}
            >
                {this.state.dropzoneActive && <div className='drop-overlay'>Drop files...</div>}
                <div className="main container gif-viewer" id="viewer">
                    <div className='side-bar'>
                        <header id="site-header">
                            <img id="site-logo" title="blueframe" src="images/logo.svg" />
                            <nav className="links">
                                <a href="https://github.com/mattbierner/blueframe">Source</a>
                                <a href="https://github.com/mattbierner/blueframe/blob/gh-pages/documentation/about.md">About</a>
                                <a href="http://blog.mattbierner.com/blueframe/">Post</a>
                            </nav>
                        </header>
                        <div className="view-controls">
                            <GifPicker
                                label=''
                                source={this.state.image}
                                onChange={this.onImageChanged.bind(this)}
                                image={this.state.imageData} />

                            <LabeledSlider
                                title='width'
                                min={1}
                                max={this.state.imageData ? this.state.imageData.width * 10 : 0}
                                value={this.state.outputWidth}
                                onChange={this.onWidthChange.bind(this)} />

                            <LabeledSlider
                                title='height'
                                min={1}
                                max={this.state.imageData ? this.state.imageData.height * 10 : 0}
                                value={this.state.outputHeight}
                                onChange={this.onHeightChange.bind(this)} />

                            <button onClick={this.onReset.bind(this)}>Reset</button>
                        </div>
                        <div className="spacer"></div>

                        <footer id="site-footer">
                            <p id="copyright">&copy; 2017 <a href="http://mattbierner.com">Matt Bierner</a></p>
                        </footer>
                    </div>

                    <GifPlayer {...this.state} />
                </div>
            </Dropzone>
        )
    }
}


ReactDOM.render(
    <Viewer />,
    document.getElementById('content'))
