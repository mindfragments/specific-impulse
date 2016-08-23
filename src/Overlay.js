import React, {Component} from 'react';

export default class Overlay extends Component {
  render() {
    const {
      speed, mass, throttle, thrust, acceleration,
      velocity, heading, track, position, reverseThrust,
      fuelFlow, fuelMass, specificImpulse, dryMass,
      trackDeg, headingDeg
    } = this.props.vessel;
    const headingStyle = {
      textAlign: 'center'
    };
    const keyStyle = {
      textAlign: 'right'
    };
    const valueStyle = {
      fontFamily: 'monospace',
      width: '20em'
    };
    const oddStyle = {
      background: '#fee'
    };
    const overlayStyle = {
      position: 'absolute',
      background: 'white',
      top: '0',
      right: '0',
      zIndex: 100
    };
    return (
      <div style={overlayStyle}>
        <div style={{float: 'right'}}>
          <button onClick={this.props.reset}>Reset Scenario</button>
					<br/><br/>
					<strong>Key controls:</strong>
					<table style={{padding: '0 20px'}}>
            <tbody>
              {Object.keys(this.props.keyBindings).map(key => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{this.props.keyBindings[key].label}</td>
                </tr>))}
            </tbody>
					</table>
        </div>
        <table>
          <thead>
            <tr>
              <th colSpan={2} style={headingStyle}>Status</th>
              <th colSpan={1} style={headingStyle}>Controls</th>
            </tr>
          </thead>
          <tbody>
            <tr style={oddStyle}>
              <th style={keyStyle}>Dry mass:</th>
              <td style={valueStyle}>{dryMass.toFixed(3)} kg</td>
              <td/>
            </tr>
            <tr>
              <th style={keyStyle}>Fuel mass:</th>
              <td style={valueStyle}>{fuelMass.toFixed(3)} kg</td>
              <td/>
            </tr>
            <tr style={oddStyle}>
              <th style={keyStyle}>Total mass:</th>
              <td style={valueStyle}>{mass.toFixed(3)} kg</td>
              <td/>
            </tr>
            <tr>
              <th style={keyStyle}>Throttle:</th>
              <td style={valueStyle}>{throttle} %</td>
              <td>
               <button onClick={this.props.throttleZero}>0</button>
               <button onClick={this.props.throttleDown}>↓</button>
               <button onClick={this.props.throttleUp}>↑</button>
               <button onClick={this.props.throttleFull}>100</button>
              </td>
            </tr>
            <tr style={oddStyle}>
              <th style={keyStyle}>Thrust:</th>
              <td style={valueStyle}>{thrust.toFixed(3)} N ; I<sub>sp</sub>={specificImpulse.toFixed(3)}</td>
              <td>
                <button onClick={this.props.invertThrust}>{reverseThrust ? '← Reverse' : 'Forward →'}</button>
              </td>
            </tr>
            <tr>
              <th style={keyStyle}>Acceleration:</th>
              <td style={valueStyle}>{acceleration.toFixed(3)} m/s²</td>
              <td/>
            </tr>
            <tr style={oddStyle}>
              <th style={keyStyle}>Heading:</th>
              <td style={valueStyle}>{headingDeg}°</td>
              <td>
                <button onClick={this.props.rotateLeft}>←</button>
                <button onClick={this.props.rotateRight}>→</button>
              </td>
            </tr>
            <tr>
              <th style={keyStyle}>Track:</th>
              <td style={valueStyle}>{trackDeg}°</td>
              <td/>
            </tr>
            <tr style={oddStyle}>
              <th style={keyStyle}>Speed:</th>
              <td style={valueStyle}>{speed.toFixed(3)} m/s</td>
              <td/>
            </tr>
            <tr>
              <th style={keyStyle}>Position:</th>
              <td style={valueStyle}>({position.x.toFixed(3)}, {position.y.toFixed(3)})</td>
              <td/>
            </tr>
            <tr style={oddStyle}>
              <th style={keyStyle}>Velocity:</th>
              <td style={valueStyle}>({velocity.x.toFixed(3)}, {velocity.y.toFixed(3)})</td>
              <td/>
            </tr>
            <tr>
              <th style={keyStyle}>Fuel flow:</th>
              <td style={valueStyle}>{fuelFlow} kg/s</td>
              <td/>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
