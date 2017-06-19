
import * as React from 'react'
import { ImageFrame } from "./image_loader";

/**
 * Property of an image.
 */
class ImageProperty extends React.Component<{ value: string | number, label: string }, null> {
    render() {
        return (
            <div className="property">
                <span className="key">{this.props.label}</span>: <span className="value">{this.props.value}</span>
            </div>
        )
    }
}

/**
 * Set of metadata displayed about an image.
 */
export default class ImageProperties extends React.Component<{ image: ImageFrame }, null> {
    render() {
        return (
            <div className="image-properties">
                <ImageProperty label="Width" value={this.props.image ? this.props.image.width : ''} />
                <ImageProperty label="Height" value={this.props.image ? this.props.image.height : ''} />
            </div>
        );
    }
}