import * as React from 'react'
import * as ReactDOM from 'react-dom'

import LoadingSpinner from './loading_spinner'
import ImageRenderer from './renderer'
import { ImageFrame } from "./image_loader"


interface ImageViewerProps {
    imageData: ImageFrame | null
    loadingImage: boolean
    outputWidth: number
}

export default class ImageViewer extends React.Component<ImageViewerProps, null> {
    private renderer: ImageRenderer;

    public export(): Promise<string> {
        return this.renderer.export()
    }

    render() {
        return (
            <div className='image-figure'>
                <ImageRenderer
                    ref={renderer => this.renderer = renderer}
                    image={this.props.imageData}
                    outputWidth={this.props.outputWidth} />
                <div>
                    <LoadingSpinner active={this.props.loadingImage} />
                </div>
            </div>
        )
    }
}
