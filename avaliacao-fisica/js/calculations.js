// js/calculations.js
const Calc = {
  imc(peso, alturaEmMetros) {
    if (!peso || !alturaEmMetros) return null;
    const val = peso / (alturaEmMetros * alturaEmMetros);
    return parseFloat(val.toFixed(2));
  },

  rcq(cintura, quadril) {
      if (!cintura || !quadril) return null;
      return parseFloat((cintura / quadril).toFixed(2));
  },

  classificacaoIMC(imc) {
    if (!imc) return "N/A";
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 24.9) return "Peso normal";
    if (imc < 29.9) return "Sobrepeso";
    if (imc < 34.9) return "Obesidade Grau 1";
    if (imc < 39.9) return "Obesidade Grau 2";
    return "Obesidade Grau 3";
  },

  idade(dataNascimento) {
      if(!dataNascimento) return 0;
      const birthDate = new Date(dataNascimento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
  },

  evolucaoPercentual(antigo, novo) {
      if(!antigo || !novo) return 0;
      return parseFloat((((novo - antigo) / antigo) * 100).toFixed(2));
  }
};

export default Calc;
