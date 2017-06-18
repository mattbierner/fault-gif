import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Gif, ImageFrame, loadGif, loadImage } from './image_loader';
import LabeledSlider from './labeled_slider';
import LoadingSpinner from './loading_spinner';
import GifPlayer from './gif_player';
import GifPicker from "./gif_picker";

interface ViewerState {
    image: string

    imageData: ImageFrame | null

    outputWidth: number
    outputHeight: number

    loadingGif: boolean

    error?: string
}

class Viewer extends React.Component<null, ViewerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            image: './images/baboon.png',

            imageData: null,

            outputWidth: 1,
            outputHeight: 1,

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

    render() {
        return (
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
                        <div className='gif-pickers'>
                            <GifPicker
                                searchTitle='Gif'
                                label=''
                                source={this.state.image}
                                onChange={this.onImageChanged.bind(this)} />
                        </div>

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
                        <a href="http://giphy.com/">
                            <img src="./images/PoweredBy_200px-Black_HorizLogo.png" alt="Powered by Giphy" />
                        </a>
                        <p id="copyright">&copy; 2017 <a href="http://mattbierner.com">Matt Bierner</a></p>
                    </footer>
                </div>

                <GifPlayer {...this.state} />
            </div>
        )
    }
}


ReactDOM.render(
    <Viewer />,
    document.getElementById('content'))
