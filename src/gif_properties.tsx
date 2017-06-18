
import * as React from 'react'
import { ImageFrame } from "./image_loader";

/**
 * Property of a gif.
 */
class GifProperty extends React.Component<{ value: string | number, label: string }, null> {
    render() {
        return (
            <div className="property">
                <span className="key">{this.props.label}</span>: <span className="value">{this.props.value}</span>
            </div>
        )
    }
}

/**
 * Set of metadata displayed about a gif.
 */
export default class GifProperties extends React.Component<{ image: ImageFrame }, null> {
    render() {
        return (
            <div className="gif-properties">
                <GifProperty label="Width" value={this.props.image ? this.props.image.width : ''} />
                <GifProperty label="Height" value={this.props.image ? this.props.image.height : ''} />
            </div>
        );
    }
}