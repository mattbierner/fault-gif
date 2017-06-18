import * as React from 'react'
import GifProperties from "./gif_properties";
import { ImageFrame } from "./image_loader";

interface GifPickerProps {
    label: string
    source: string
    image: ImageFrame
    onChange: (gif: string) => void
}


export default class GifPicker extends React.Component<GifPickerProps, null> {
    private onChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(window.URL.createObjectURL(e.target.files[0]))
    }

    render() {
        return (
            <div className='image-picker control-group'>
                <img src={this.props.source} />
                <GifProperties image={this.props.image} />
                <input
                    type='file'
                    accept='image/*'
                    onChange={this.onChange.bind(this)} />
            </div>
        )
    }
}