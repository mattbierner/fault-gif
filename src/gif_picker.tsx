import * as React from 'react'
import GifProperties from "./gif_properties";
import { Gif } from "./image_loader";

interface GifPickerProps {
    searchTitle: string
    label: string
    source: string
    onChange: (gif: string) => void
}


export default class GifPicker extends React.Component<GifPickerProps, null> {
    private onChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(window.URL.createObjectURL(e.target.files[0]))
    }

    render() {
        return (
            <div className='image-picker'>
                <img src={this.props.source} />
                <input type='file' accept="image/*" onChange={this.onChange.bind(this)} />
            </div>
        )
    }
}