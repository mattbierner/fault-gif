import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ImageFrame, loadImage } from './image_loader';
import LabeledSlider from './labeled_slider';
import LoadingSpinner from './loading_spinner';
import ImageViewer from './image_viewer';
import ImagePicker from "./image_picker";
const Dropzone = require('react-dropzone')

interface ViewerState {
    image: string
    imageData: ImageFrame | null

    outputWidth: number
    outputHeight: number

    loadingImage: boolean
    dropzoneActive: boolean

    error?: string
}

class Viewer extends React.Component<null, ViewerState> {
    private player: ImageViewer;

    constructor(props: any) {
        super(props);
        this.state = {
            image: './images/mandrill.png',

            imageData: null,

            outputWidth: 1,
            outputHeight: 1,

            dropzoneActive: false,
            loadingImage: false
        }
    }

    componentDidMount() {
        this.loadImage(this.state.image)
    }

    private loadImage(image: string) {
        this.setState({ loadingImage: true })

        return (
            image && this.state.imageData && this.state.imageData.source === image
                ? Promise.resolve(this.state.imageData)
                : loadImage(image, true))
            .then(leftData => {
                if (image !== this.state.image)
                    return

                this.setState({
                    imageData: leftData,

                    outputWidth: leftData.width,
                    outputHeight: leftData.height,

                    loadingImage: false,
                    error: null
                })
            })
            .catch(e => {
                if (image !== this.state.image)
                    return

                console.error(e)
                this.setState({
                    imageData: null,

                    loadingImage: false,
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

    private onDragEnter() {
        this.setState({
            dropzoneActive: true
        });
    }

    private onDragLeave() {
        this.setState({
            dropzoneActive: false
        });
    }

    private onDrop(files: any[]) {
        if (files.length) {
            this.onImageChanged(window.URL.createObjectURL(files[0]))
        }

        this.setState({ dropzoneActive: false })
    }

    private export() {
        this.player.export().then(url => {
            window.open(url)
        });
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
                {this.state.dropzoneActive && <div className='drop-overlay'>Drop file...</div>}
                <div className="main container gif-viewer" id="viewer">
                    <div className='side-bar'>
                        <header id="site-header">
                            <img id="site-logo" title="reflow" src="images/logo.svg" />
                            <nav className="links">
                                <a href="https://github.com/mattbierner/reflow">Source</a>
                                <a href="https://github.com/mattbierner/reflow/#readme">About</a>
                                <a href="http://blog.mattbierner.com/reflow/">Post</a>
                            </nav>
                        </header>
                        <div className="view-controls">
                            <ImagePicker
                                label=''
                                source={this.state.image}
                                onChange={this.onImageChanged.bind(this)}
                                image={this.state.imageData} />

                            <LabeledSlider
                                title='width'
                                min={1}
                                max={this.state.imageData ? this.state.imageData.width * 4 : 0}
                                value={this.state.outputWidth}
                                onChange={this.onWidthChange.bind(this)} />

                            <LabeledSlider
                                title='height'
                                min={1}
                                max={this.state.imageData ? this.state.imageData.height * 4 : 0}
                                value={this.state.outputHeight}
                                onChange={this.onHeightChange.bind(this)} />


                            <button className='reset-button' onClick={this.onReset.bind(this)}>Reset</button>

                            <button onClick={this.export.bind(this)}>Export</button>
                        </div>

                        <footer id="site-footer">
                            <p id="copyright">&copy; 2017 <a href="http://mattbierner.com">Matt Bierner</a></p>
                        </footer>
                    </div>

                    <ImageViewer {...this.state} ref={player => this.player = player} />
                </div>
            </Dropzone>
        )
    }
}


ReactDOM.render(
    <Viewer />,
    document.getElementById('content'))
