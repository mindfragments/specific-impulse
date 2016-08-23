import vesselReducer from './vesselReducer';
import spheresReducer from './spheresReducer';

function vesselCollided(vessel, sphere) {
  const a = sphere.position.x - vessel.position.x,
        b = sphere.position.y - vessel.position.y;
  return Math.sqrt(a*a + b*b) < sphere.radius;
}

export default function(state, action) {
  if(state && state.collided) {
    return state;
  }
  const vessel = vesselReducer(state && state.vessel, action);
  const spheres = spheresReducer(state && state.spheres, action);
  for(let i = 0, n = spheres.length; i < n; i++) {
    if(vesselCollided(vessel, spheres[i])) {
      return {vessel, spheres, collided: spheres[i]};
    }
  }
  return {vessel, spheres};
}
