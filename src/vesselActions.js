export function throttleZero() {
  return {type: 'THROTTLE_ZERO'};
}

export function throttleDown() {
  return {type: 'THROTTLE_DOWN'};
}

export function throttleUp() {
  return {type: 'THROTTLE_UP'};
}

export function throttleFull() {
  return {type: 'THROTTLE_FULL'};
}

export function warp(t) {
  return {type: 'WARP', t};
}

export function rotateLeft() {
  return {type: 'ROTATE_LEFT'};
}

export function rotateRight() {
  return {type: 'ROTATE_RIGHT'};
}

export function invertThrust() {
  return {type: 'INVERT_THRUST'};
}

export function reset() {
  return {type: 'RESET'};
}

export function turnPrograde() {
  return {type: 'TURN_PROGRADE'};
}

export function turnRetrograde() {
  return {type: 'TURN_RETROGRADE'};
}

export function turnNormal() {
  return {type: 'TURN_NORMAL'};
}

export function turnAntinormal() {
  return {type: 'TURN_ANTINORMAL'};
}
