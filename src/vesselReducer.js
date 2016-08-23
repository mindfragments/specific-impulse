function magnitude(v) {
  const {x, y} = v;
  return Math.sqrt(x*x + y*y);
}

function normalizeAngle(angle) {
  const twoPi = Math.PI * 2;
  if(angle >= twoPi) {
    return angle - twoPi;
  } else if(angle < 0) {
    return angle + twoPi;
  } else {
    return angle;
  }
}

function rad2deg(rad) { return rad*180/Math.PI; }
function deg2rad(deg) { return deg/180*Math.PI; }

function updateComputed(state) {
  const {dryMass, fuelMass, maxThrustFuelFlow, throttle,
         maxThrust, velocity, reverseThrust, headingDeg} = state;
  const thrust = fuelMass > 0 ? maxThrust * throttle / (reverseThrust ? -1000 : 100) : 0;
  const mass = dryMass + fuelMass;
  const fuelFlow = fuelMass > 0 ? maxThrustFuelFlow * throttle / 100 : 0;
  const burning = fuelFlow > 0;
  const track = normalizeAngle(Math.atan2(velocity.y, velocity.x) + Math.PI / 2);
  return {
    ...state,
    thrust,
    mass,
    fuelFlow,
    burning,
    acceleration: thrust/mass,
    speed: magnitude(velocity),
    trackDeg: Math.round(rad2deg(track)),
    track: track,
    heading: deg2rad(Math.round(headingDeg)),
    headingDeg: Math.round(headingDeg),
    specificImpulse: Math.abs(thrust) > 0.0001 ?  Math.abs(thrust) / fuelFlow : 0
  };
}

function setThrottle(value, state) {
  return updateComputed({...state, throttle: value});
}

function warp(dt, state) {
  const {position, heading, velocity, acceleration, fuelMass, fuelFlow} = state;
  const fuelFactor = fuelMass >= fuelFlow ? 1 : fuelMass / fuelFlow;
  const newPosition = {
    x: position.x + velocity.x * dt,
    y: position.y + velocity.y * dt
  };
  const newVelocity = {
    x: velocity.x + Math.sin(heading) * acceleration * dt * fuelFactor,
    y: velocity.y - Math.cos(heading) * acceleration * dt * fuelFactor
  };
  return updateComputed({
    ...state,
    position: newPosition,
    velocity: newVelocity,
    fuelMass: fuelFactor === 1 ? fuelMass - fuelFlow * dt : 0
  });
}

const initialState = {
  last: null,
  speed: 0,
  dryMass: 150,
  throttle: 0,
  maxThrust: 168.4,
  velocity: {x: 0, y: 0},
  headingDeg: 0,
  position: {x: 0, y: 0},
  fuelMass: 170,
  maxThrustFuelFlow: 2.54,
  reverseThrust: false
};

function vesselReducer(state, action) {
  if(!state) {
    state = updateComputed(initialState);
  }
  switch(action.type) {
  case 'THROTTLE_UP':
    return setThrottle(Math.min(state.throttle + 1, 100), state);
  case 'THROTTLE_DOWN':
    return setThrottle(Math.max(state.throttle - 1, 0), state);
  case 'THROTTLE_FULL':
    return setThrottle(100, state);
  case 'THROTTLE_ZERO':
    return setThrottle(0, state);
  case 'ROTATE_LEFT':
    return updateComputed({
      ...state,
      headingDeg: state.headingDeg - 1
    });
  case 'ROTATE_RIGHT':
    return updateComputed({
      ...state,
      headingDeg: state.headingDeg + 1
    });
  case 'INVERT_THRUST':
    return updateComputed({
      ...state,
      reverseThrust: !state.reverseThrust
    });
  case 'TURN_PROGRADE':
    return updateComputed({
      ...state,
      headingDeg: state.trackDeg
    });
  case 'TURN_RETROGRADE':
    return updateComputed({
      ...state,
      headingDeg: state.trackDeg - 180
    });
  case 'TURN_NORMAL':
    return updateComputed({
      ...state,
      headingDeg: state.trackDeg + 90
    });
  case 'TURN_ANTINORMAL':
    return updateComputed({
      ...state,
      headingDeg: state.trackDeg - 90
    });
  case 'WARP':
    const {last} = state;
    return warp(last ? (action.t - last)/1000 : 0, {...state, last: action.t});
  case 'RESET':
    return updateComputed(initialState);
  default:
    return state;
  }
}

export default vesselReducer;
