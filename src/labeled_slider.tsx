import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface LabeledRangeProps {
    title?: string
    className?: string
    units?: string
    min: number
    max: number
    value: number
    onChange: (value: number) => void
}


export default class LabeledRange extends React.Component<LabeledRangeProps, null> {

    onChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.onChange(+e.target.value);
    }

    onNext() {
        if (this.props.value >= this.props.max) {
            return
        }
        this.props.onChange(this.props.value + 1)
    }

    onPrevious() {
        if (this.props.value <= this.props.min) {
            return
        }
        this.props.onChange(this.props.value - 1)
    }

    render() {
        const title = this.props.title ? (<div className='control-title'>{this.props.title}</div>) : ''
        return (
            <div className={'control-group labeled-slider ' + (this.props.className || '')}>
                {title}
                <input className="slider"
                    type="range"
                    min={this.props.min}
                    max={this.props.max}
                    value={this.props.value}
                    onChange={this.onChange.bind(this)} />
                <span className="min label">{this.props.min}</span>
                <span className="max label">{this.props.max}</span>
                <span className="value label">{this.props.value + (this.props.units || '')}</span>
                <div className='range-buttons'>
                    <button onClick={this.onPrevious.bind(this)}>-</button>
                    <button onClick={this.onNext.bind(this)}>+</button>
                </div>
            </div>
        )
    }
}


