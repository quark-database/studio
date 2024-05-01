/**
 * Generates a random number between
 * min and max value excluding the max one.
 *
 * @param min the inclusive minimal random value.
 * @param max the exclusive maximal random value.
 * @returns {number} a random integer.
 */
export function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}