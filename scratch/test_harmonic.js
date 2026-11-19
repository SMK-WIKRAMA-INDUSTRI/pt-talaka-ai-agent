const CX = 500;
const CY = 520;
const R = 230; // Radius of arch dome

// Let's verify how clean, harmonic bezier curves look for each node
// In the original design, lines emanate radially from the arch outwards to the popups!
// When you look at an arch, radial lines have equation:
// Center is (CX, CY) = (500, 520).
// An ideal radial ray at angle phi has direction (cos(phi), sin(phi)).
// A gentle curve bends smoothly between the node's position and its entry on the arch.

console.log("Testing harmonic curves...");
