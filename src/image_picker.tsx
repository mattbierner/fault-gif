import * as React from 'react'
import ImageProperties from "./image_properties";
import { ImageFrame } from "./image_loader";

interface ImagePickerProps {
    label: string
    source: string
    image: ImageFrame
    onChange: (image: string) => void
}


export default class ImagePicker extends React.Component<ImagePickerProps, null> {
    private onChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(window.URL.createObjectURL(e.target.files[0]))
    }

    render() {
        return (
            <div className='image-picker control-group'>
                <img src={this.props.source} />
                <ImageProperties image={this.props.image} />
                <input
                    type='file'
                    accept='image/*'
                    onChange={this.onChange.bind(this)} />
            </div>
        )
    }
}