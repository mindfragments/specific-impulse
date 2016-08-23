const initialState = [
  {position: {x: 0, y: 101}, radius: 100, g: 9.8, color: 0x22cc44}
];

export default function spheresReducer(state, action) {
  return state || initialState;
}
