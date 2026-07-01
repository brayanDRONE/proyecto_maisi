/**
 * Formatea un monto en pesos chilenos (CLP)
 * Resultado: "$12.990" (sin decimales, separador de miles con punto)
 * @param {number} amount - Monto a formatear
 * @returns {string}
 */
export const formatCLP = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default formatCLP
