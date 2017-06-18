import * as React from 'react'
import * as ReactDOM from 'react-dom'

import LoadingSpinner from './loading_spinner'
import GifRenderer from './gif_renderer'
import { ImageFrame } from "./image_loader"


interface GifPlayerProps {
    imageData: ImageFrame | null
    loadingGif: boolean
    outputWidth: number
}

export default class GifPlayer extends React.Component<GifPlayerProps, null> {
    render() {
        return (
            <div className='gif-figure'>
                <GifRenderer
                    image={this.props.imageData}
                    outputWidth={this.props.outputWidth} />
                <div>
                    <LoadingSpinner active={this.props.loadingGif} />
                </div>
            </div>
        )
    }
}
